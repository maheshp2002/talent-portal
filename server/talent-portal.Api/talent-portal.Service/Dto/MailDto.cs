namespace talent_portal.Service.Dto;

/// <summary>
/// Represents a MailDto that can be used to store email, subject and body for sending email.
/// </summary>
public class MailDto
{
    /// <summary>
    /// Gets or sets the Email of the MailDto.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Gets or sets the Subject of the MailDto.
    /// </summary>
    public string Subject { get; set; }

    /// <summary>
    /// Gets or sets the Body of the MailDto.
    /// </summary>
    public string? Body { get; set; }
}
