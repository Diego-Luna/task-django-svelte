# backend/tasks/models.py
from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator
from django.utils.translation import gettext_lazy as _

class Task(models.Model):
    STATUS_CHOICES = (
        ('todo', 'To Do'),
        ('done', 'Done'),
    )
    
    title = models.CharField(
        max_length=200, 
        verbose_name=_("Title"),
        validators=[
            MinLengthValidator(3, _("Title must be at least 3 characters")),
            RegexValidator(
                regex=r'^[a-zA-Z0-9\s\.,!?()-]+$',
                message=_('Title can only contain letters, numbers, and basic punctuation'),
                code='invalid_title'
            )
        ]
    )
    description = models.TextField(
        blank=True, 
        null=True, 
        verbose_name=_("Description"),
        validators=[
            MaxLengthValidator(5000, _("Description must be less than 5000 characters"))
        ]
    )
    status = models.CharField(
        max_length=4, 
        choices=STATUS_CHOICES, 
        default='todo',
        verbose_name=_("Status")
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Last updated"))
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),  # Add index for frequently filtered fields
            models.Index(fields=['-created_at']),
        ]
        verbose_name = _("Task")
        verbose_name_plural = _("Tasks")
    
    def __str__(self):
        return self.title
    
    def clean(self):
        """Additional validation logic"""
        # You can add more complex validation here
        if self.title and len(self.title.strip()) < 3:
            from django.core.exceptions import ValidationError
            raise ValidationError({'title': _("Title must be at least 3 characters")})