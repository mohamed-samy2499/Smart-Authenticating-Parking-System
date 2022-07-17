using System;
using System.Net.Mail;
using System.Net;
using DotNetEnv;

namespace Parking_System_API.Email
{
    public class EmailCode
    {
        public static bool SendEmail(string ToEmail, string password, string mode = "Registration")
        {
                Env.Load();
                SmtpClient smtpClient = new SmtpClient();
                NetworkCredential basicCredential = new NetworkCredential(System.Environment.GetEnvironmentVariable("EMAIL") ?? throw new ArgumentNullException(), System.Environment.GetEnvironmentVariable("PASSWORD") ?? throw new ArgumentNullException());
                MailMessage message = new MailMessage();
                MailAddress fromAddress = new MailAddress(System.Environment.GetEnvironmentVariable("EMAIL") ?? throw new ArgumentNullException());


                smtpClient.EnableSsl = true;
                smtpClient.Host = "smtp.gmail.com";
                smtpClient.Port = 587;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = basicCredential;

                message.From = fromAddress;
                message.Subject = $"Parking System Account {mode}";
                //Set IsBodyHtml to true means you can send HTML email.
                message.IsBodyHtml = false;
                message.Body = $"Your Password is {password}";
                message.To.Add(ToEmail);
                try { 

                     smtpClient.Send(message);
                        return true;

                }
                catch (Exception)
                {
                    return false;
                 }
        }
    }
}
