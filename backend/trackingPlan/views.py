import json
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
import jsonschema
from .models import Event, TrackingPlan, Source
from .serializers import EventSerializer, TrackingPlanSerializer, SourceSerializer
import requests
from jsonschema import validate
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404


@csrf_exempt
@api_view(['GET'])
def get_events(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@csrf_exempt
@api_view(['GET'])
def get_event_by_name(request, name=None):
    try:
        event = Event.objects.get(name=name)
        serializer = EventSerializer(event)
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['POST'])
def save_event(request):
    json_body = request.data
    name = json_body.get('name')
    try:
        # Attempt to retrieve the event by name
        event = Event.objects.get(name=name)
        # If found, update the event
        return update_event(request, event)
    except Event.DoesNotExist:
        # If not found, create a new event
        return create_event(request)


def create_event(request):
    json_body = request.data
    rules = json_body.get('rules')

    # Validation process
    error_response = validate_event_rules(rules)
    if error_response:
        return error_response

    schema_url = rules.get('$schema')
    schema = fetch_schema(schema_url)
    if schema is None:
        return Response({"error": "Unable to fetch schema"}, status=status.HTTP_400_BAD_REQUEST)

    # Schema validation
    if not validate_json_with_schema(json_body, schema):
        return Response({"error": "Schema invalid"}, status=status.HTTP_400_BAD_REQUEST)

    # Serialization process
    return serialize_and_save_event(json_body)


def validate_event_rules(rules):
    if not rules:
        return Response({"error": "Rules object cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
    if not rules.get('$schema'):
        return Response({"error": "Schema URL required"}, status=status.HTTP_400_BAD_REQUEST)
    return None  # Explicitly return None if validation passes


def fetch_schema(schema_url):
    response = requests.get(schema_url)
    if response.status_code == 200:
        return response.json()
    return None


def validate_json_with_schema(json_body, schema):
    try:
        jsonschema.validate(json_body, schema)
        return True
    except jsonschema.exceptions.ValidationError:
        return False


def serialize_and_save_event(json_body):
    serializer = EventSerializer(data=json_body)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "New Event created successfully"}, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": f"New event creation failed due to {serializer.errors}"}, status=status.HTTP_400_BAD_REQUEST)


# This corrected code will return a 201 Created response with the message "Data has been saved" if the json_body conforms to the fetched schema. If the validation fails, it will return a 400 Bad Request response with the message "schema invalid".
def update_event(request, event):
    # event = Event.objects.get(name=name)
    serializer = EventSerializer(event, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Event update successful"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Failure in updating the event"}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
def get_tracking_plans(request):
    tracking_plans = TrackingPlan.objects.all()
    serializer = TrackingPlanSerializer(tracking_plans, many=True)
    return Response(serializer.data)


@csrf_exempt
@api_view(['GET'])
def get_tracking_plan_by_name(request, name):
    try:
        trackingPlan = TrackingPlan.objects.get(name=name)
        serializer = TrackingPlanSerializer(trackingPlan)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['DELETE'])
def remove_event_from_tracking_plan(request, tracking_plan_name, event_name):
    try:
        tracking_plan = TrackingPlan.objects.get(name=tracking_plan_name)
        event_to_remove = Event.objects.get(name=event_name)
        tracking_plan.events.remove(event_to_remove)
        return Response({"message": "Event removed from Tracking Plan successfully"}, status=status.HTTP_200_OK)
    except TrackingPlan.DoesNotExist:
        return Response({"error": "Tracking Plan not found"}, status=status.HTTP_404_NOT_FOUND)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['POST'])
def create_or_update_tracking_plan(request):
    payload = request.data

    # Parse data from the payload
    display_name = payload['display_name']
    # Optional field with default value
    description = payload.get('description', '')
    # Optional field with default value
    source_name = payload.get('source', '')
    rules = payload.get('rules', {})  # Optional field with default value
    events = rules.get('events', [])  # Optional field with default value

    # Create or update the TrackingPlan model instance
    tracking_plan, created = TrackingPlan.objects.get_or_create(
        name=display_name)
    tracking_plan.description = description

    # Handle source creation or fetching
    if source_name:
        source_instance, _ = Source.objects.get_or_create(name=source_name)
        tracking_plan.source = source_instance

    tracking_plan.save()
    print(tracking_plan.name)
    print(tracking_plan.source)
    print(tracking_plan.events)

    # Clear existing events and add new ones
    tracking_plan.events.clear()
    for event_data in events:
        event_name = event_data['name']
        try:
            event = Event.objects.get(name=event_name)
        except Event.DoesNotExist:
            event_request = request._request.clone()
            event_request.data = event_data
            # Assuming this function exists and creates an event
            create_event(event_request)
            event = Event.objects.get(name=event_name)

        tracking_plan.events.add(event)

    # Serialize the tracking plan and return
    serializer = TrackingPlanSerializer(tracking_plan)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@csrf_exempt
@api_view(['GET'])
def get_sources(request, source_name=None):
    if source_name:
        try:
            source = Source.objects.get(name=source_name)
            serializer = SourceSerializer(source)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Source.DoesNotExist:
            return Response({"error": "Source not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        sources = Source.objects.all()
        serializer = SourceSerializer(sources, many=True)
        return Response(serializer.data)


@csrf_exempt
@api_view(['POST'])
def save_source_with_name(request):
    json_body = request.data
    name = json_body.get('name')
    serializer = SourceSerializer(data=json_body)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # This will raise a generic APIException when there's a failure.
            raise APIException(
                "There was an error saving the source: " + str(e))
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
