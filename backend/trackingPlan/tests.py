from django.test import TestCase
from .models import Event
from jsonschema import validate, ValidationError
import json


class SchemaValidationTestCase(TestCase):
    # Define real-world event data that should validate successfully
    validTestData = [
        {"product": "product1", "price": 100, "currency": "USD"},
        {"product": "product2", "price": 200, "currency": "EUR"},
        {"product": "product3", "price": 150, "currency": "JPY"},
    ]

    # Define real-world event data that should fail validation
    invalidTestData = [
        {"price": 100, "currency": "USD"},
        {},
        {"product": 1234, "price": 100, "currency": "USD"},
        {"product": "product1", "price": "100", "currency": "USD"},
        {"product": "product1", "price": 100, "currency": 1234},
        {"product": "product1", "price": -100, "currency": "USD"},
        {"product": "product1", "price": 100, "currency": "USD", "extra": "extra"},
        {"product": None, "price": None, "currency": None},
        {"product": "", "price": "", "currency": ""},
        {"product": "ap1", "price": "10", "currency": "INR"},
    ]

    def test_event_data(self):
        # Fetch the existing event schema from the database
        events = Event.objects.all()

        # Check validation for all events
        for event in events:
            schema = event.rules
            for valid_data in self.validTestData:
                try:
                    # Validate the valid data against the schema
                    validate(valid_data, schema)
                except ValidationError as v:
                    self.fail(
                        f"Validation failed for valid data on event {event.name}: {str(v)}")

            for invalid_data in self.invalidTestData:
                try:
                    # Validate the invalid data against the schema
                    # This should raise a ValidationError
                    validate(invalid_data, schema)
                except ValidationError:
                    pass  # This is expected
                else:
                    self.fail(
                        f"Validation did not fail for invalid data on event {event.name}")
