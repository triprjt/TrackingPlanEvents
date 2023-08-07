from django.db import models
# import jsonfield
# Create your models here.


class Event(models.Model):
    name = models.CharField(max_length=255, unique=True,
                            null=False, blank=False, primary_key=True)
    description = models.TextField(null=True, blank=True)
    rules = models.JSONField(null=False, blank=False)

    def __str__(self):
        return self.name


class Source(models.Model):
    name = models.CharField(max_length=255, unique=True, primary_key=True)

    def __str__(self):
        return self.name


class TrackingPlan(models.Model):
    name = models.CharField(max_length=255, unique=True, primary_key=True)
    description = models.TextField(null=True, blank=True)
    events = models.ManyToManyField(
        Event, blank=True, related_name='tracking_plan')
    source = models.OneToOneField(Source, null=True,
                                  blank=True,
                                  on_delete=models.SET_NULL,
                                  related_name="source_tracking_plan")

    def __str__(self):
        return self.name
