from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0005_companydetails_companydetails_unique_company_details'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='companyadmin',
            name='casual_leave_days',
        ),
        migrations.RemoveField(
            model_name='companyadmin',
            name='sick_leave_days',
        ),
        migrations.RemoveField(
            model_name='companyadmin',
            name='personal_leave_days',
        ),
        migrations.RemoveField(
            model_name='companyadmin',
            name='total_employees',
        ),
        migrations.RemoveField(
            model_name='companyadmin',
            name='company_name',
        ),
        migrations.RemoveField(
            model_name='companyadmin',
            name='company_website',
        ),
        migrations.RemoveField(
            model_name='companyadmin',
            name='timezone',
        ),
        migrations.RemoveField(
            model_name='companyadmin',
            name='currency',
        ),
    ]
