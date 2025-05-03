from django.db import models

class Task(models.Model):
    STATUS_CHOICES = (
        ('todo', 'À faire'),
        ('done', 'Terminée'),
    )
    
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    status = models.CharField(
        max_length=4, 
        choices=STATUS_CHOICES, 
        default='todo',
        verbose_name="Statut"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Dernière mise à jour")
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title