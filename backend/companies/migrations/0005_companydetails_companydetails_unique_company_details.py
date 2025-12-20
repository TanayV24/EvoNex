# companies/migrations/0005_companydetails_companydetails_unique_company_details.py
# FAKE MIGRATION - Table already exists in Supabase

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0004_department'),
    ]

    operations = [
        migrations.RunSQL(
            sql='SELECT 1;',
            reverse_sql='SELECT 1;',
        ),
    ]
