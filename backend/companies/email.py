# companies/email.py - UPDATED WITH HR INVITATION

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


class CompanyEmailService:
    """Service to handle all email communications for companies"""

    @staticmethod
    def send_admin_credentials(personal_email, company_name, admin_email, temp_password, token=None):
        """
        Send admin login credentials to personal email
        
        Args:
            personal_email: Admin's personal email (Gmail, etc.)
            company_name: Company name
            admin_email: Admin company email (admin@COMPANY_CODE.com)
            temp_password: Temporary password
            token: Registration token for verification
        
        Returns:
            bool: True if email sent, False if failed
        """
        try:
            subject = f'WorkOS Admin Account Created - {company_name}'
            
            # Email body
            html_message = f"""
            <h2>Hello,</h2>
            <p>Your admin account for <strong>{company_name}</strong> has been created!</p>
            
            <h3>Login Credentials:</h3>
            <p><strong>Email:</strong> <code>{admin_email}</code></p>
            <p><strong>Temporary Password:</strong> <code>{temp_password}</code></p>
            
            <p style="color: red; font-weight: bold;">⚠️ Important:</p>
            <p>If you didn't request this account or have any questions, please contact our support team.</p>
            
            <hr>
            <p>© 2024 WorkOS. All rights reserved.</p>
            <p><em>This is an automated email. Please do not reply.</em></p>
            """
            
            send_mail(
                subject=subject,
                message='Click the link to reset password',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[personal_email],
                html_message=html_message,
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"❌ Error sending admin credentials email: {str(e)}")
            return False

    @staticmethod
    def send_hr_invitation(personal_email, company_name, hr_email, temp_password):
        """
        Send HR invitation email with login credentials
        
        Args:
            personal_email: HR's personal email
            company_name: Company name
            hr_email: HR company email
            temp_password: Temporary password
        
        Returns:
            bool: True if email sent, False if failed
        """
        try:
            subject = f'WorkOS HR Account Created - {company_name}'
            
            html_message = f"""
            <h2>Hello,</h2>
            <p>Your HR account for <strong>{company_name}</strong> has been created!</p>
            
            <h3>Login Credentials:</h3>
            <p><strong>Email:</strong> <code>{hr_email}</code></p>
            <p><strong>Temporary Password:</strong> <code>{temp_password}</code></p>
            
            <h3>What's Next:</h3>
            <ol>
                <li>Log in with the credentials above</li>
                <li>Change your password (required on first login)</li>
                <li>Complete your profile</li>
                <li>Start managing your company's HR operations</li>
            </ol>
            
            <p style="color: red; font-weight: bold;">⚠️ Important:</p>
            <p>If you didn't request this account or have any questions, please contact our support team.</p>
            
            <hr>
            <p>© 2024 WorkOS. All rights reserved.</p>
            <p><em>This is an automated email. Please do not reply.</em></p>
            """
            
            send_mail(
                subject=subject,
                message='Your HR account has been created',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[personal_email],
                html_message=html_message,
                fail_silently=False,
            )
            print(f"✓ HR invitation email sent to {personal_email}")
            return True
        except Exception as e:
            print(f"❌ Error sending HR invitation email: {str(e)}")
            return False

    @staticmethod
    def send_employee_invitation(personal_email, company_name, invite_link):
        """
        Send employee invitation email (You can use this later)
        """
        try:
            subject = f'You are invited to {company_name} on WorkOS'
            html_message = f"""
            <h2>You have been invited!</h2>
            <p>You have been invited to join <strong>{company_name}</strong> on WorkOS.</p>
            <p><a href="{invite_link}">Accept Invitation</a></p>
            <p>This invitation expires in 7 days.</p>
            """
            send_mail(
                subject=subject,
                message='You are invited to join the company',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[personal_email],
                html_message=html_message,
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"❌ Error sending invitation email: {str(e)}")
            return False
        
        @staticmethod
        def send_manager_invitation(personal_email, company_name, manager_email, temp_password):
            """
            Send manager invitation email with login credentials
            
            Args:
                personal_email: Manager's personal email (where to send)
                company_name: Company name
                manager_email: Manager's company email (for login)
                temp_password: Temporary password for first login
            
            Returns:
                bool: True if email sent, False if failed
            """
            
            try:
                subject = f'WorkOS Manager Account Created - {company_name}'
                
                # Create HTML email
                html_message = f"""
                <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #0066cc;">Welcome to {company_name}!</h2>
                        
                        <p>Your manager account has been created on WorkOS.</p>
                        
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Email:</strong></p>
                            <p style="font-family: monospace; font-size: 16px; background: white; padding: 10px; border-radius: 3px;">
                                {manager_email}
                            </p>
                            
                            <p style="margin-top: 15px;"><strong>Temporary Password:</strong></p>
                            <p style="font-family: monospace; font-size: 16px; background: white; padding: 10px; border-radius: 3px;">
                                {temp_password}
                            </p>
                        </div>
                        
                        <p><strong>Next Steps:</strong></p>
                        <ol>
                            <li>Visit: <a href="https://yourapp.com/login">https://yourapp.com/login</a></li>
                            <li>Enter your email and temporary password</li>
                            <li>Change your password to something secure</li>
                            <li>Complete your profile</li>
                            <li>Start using WorkOS!</li>
                        </ol>
                        
                        <div style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0;">
                            <p><strong>⚠️ Important:</strong></p>
                            <p>If you didn't request this account or have any questions, please contact your administrator.</p>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <p style="font-size: 12px; color: #666;">
                            © 2024 WorkOS. All rights reserved.
                            <br>
                            This is an automated email. Please do not reply to this message.
                        </p>
                    </div>
                </body>
                </html>
                """
                
                plain_text = f"""
                Welcome to {company_name}!
                
                Your manager account has been created on WorkOS.
                
                Email: {manager_email}
                Temporary Password: {temp_password}
                
                Next Steps:
                1. Visit: https://yourapp.com/login
                2. Enter your email and temporary password
                3. Change your password to something secure
                4. Complete your profile
                5. Start using WorkOS!
                
                If you didn't request this account or have any questions, 
                please contact your administrator.
                
                © 2024 WorkOS
                """
                
                send_mail(
                    subject=subject,
                    message=plain_text,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[personal_email],
                    html_message=html_message,
                    fail_silently=False,
                )
                
                print(f"✓ Manager invitation email sent to {personal_email}")
                return True
            
            except Exception as e:
                print(f"❌ Error sending manager invitation email: {str(e)}")
                return False
