# Generated by Django 4.2.4 on 2023-08-07 07:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Event",
            fields=[
                (
                    "name",
                    models.CharField(
                        max_length=255, primary_key=True, serialize=False, unique=True
                    ),
                ),
                ("description", models.TextField(blank=True, null=True)),
                ("rules", models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name="Source",
            fields=[
                (
                    "name",
                    models.CharField(
                        max_length=255, primary_key=True, serialize=False, unique=True
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TrackingPlan",
            fields=[
                (
                    "name",
                    models.CharField(
                        max_length=255, primary_key=True, serialize=False, unique=True
                    ),
                ),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "events",
                    models.ManyToManyField(
                        blank=True,
                        related_name="tracking_plan",
                        to="trackingPlan.event",
                    ),
                ),
                (
                    "source",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="source_tracking_plan",
                        to="trackingPlan.source",
                    ),
                ),
            ],
        ),
    ]
