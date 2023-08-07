from rest_framework import serializers
from .models import Event, TrackingPlan, Source


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['name', 'description', 'rules']


class TrackingPlanSerializer(serializers.ModelSerializer):
    events = serializers.StringRelatedField(many=True)
    source = serializers.StringRelatedField()

    class Meta:
        model = TrackingPlan
        fields = ['name', 'description', 'events', 'source']


class SourceSerializer(serializers.ModelSerializer):
    source_tracking_plan = TrackingPlanSerializer(read_only=True)

    class Meta:
        model = Source
        fields = ['name', 'source_tracking_plan']
