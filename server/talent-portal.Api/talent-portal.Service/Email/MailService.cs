using Microsoft.Extensions.Options;
using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;
using talent_portal.Service.Dto;

namespace talent_portal.Service.Email;

/// <summary>
/// Provides functionality to send emails using SMTP.
/// </summary>
public class MailService
{
    private readonly MailSettings _settings;

    /// <summary>
    /// Initializes a new instance of the <see cref="MailService"/> class.
    /// </summary>
    /// <param name="settings">The mail settings configuration object.</param>
    public MailService(IOptions<MailSettings> settings)
    {
        _settings = settings.Value;
    }

    /// <summary>
    /// Sends an email asynchronously.
    /// </summary>
    /// <param name="mailData">The mail data.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A boolean indicating whether the email was sent successfully or not.</returns>
    public async Task<bool> SendAsync(MailDto mailData)
    {
        try
        {
            var mail = new MimeMessage();

            #region Sender / Receiver
            mail.From.Add(new MailboxAddress(_settings.DisplayName, _settings.From));
            mail.Sender = new MailboxAddress(_settings.DisplayName, mailData.Email);

            mail.To.Add(MailboxAddress.Parse(mailData.Email));

            if (!string.IsNullOrEmpty(mailData.Email))
                mail.ReplyTo.Add(new MailboxAddress(mailData.Email, mailData.Email));

            #endregion

            #region Content

            var body = new BodyBuilder();
            mail.Subject = mailData.Subject;
            body.HtmlBody = mailData.Body;
            mail.Body = body.ToMessageBody();

            #endregion

            #region Send Mail

            using var smtp = new SmtpClient();

            if (_settings.UseSSL)
            {
                await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.SslOnConnect);
            }
            else if (_settings.UseStartTls)
            {
                await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
            }
            await smtp.AuthenticateAsync(_settings.UserName, _settings.Password);
            await smtp.SendAsync(mail);
            await smtp.DisconnectAsync(true);

            #endregion

            return true;

        }
        catch (Exception)
        {
            return false;
        }
    }
}