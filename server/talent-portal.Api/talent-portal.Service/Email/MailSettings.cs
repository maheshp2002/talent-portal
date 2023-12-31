namespace talent_portal.Service.Email;

/// <summary>
/// Represents a MailSettings that can be used to store mail settings data.
/// </summary>
public class MailSettings
{
    /// <summary>
    /// Gets or sets the DisplayName of the MailSettings.
    /// </summary>
    public string? DisplayName { get; set; }

    /// <summary>
    /// Gets or sets the From of the MailSettings.
    /// </summary>
    public string? From { get; set; }

    /// <summary>
    /// Gets or sets the UserName of the MailSettings.
    /// </summary>
    public string? UserName { get; set; }

    /// <summary>
    /// Gets or sets the Password of the MailSettings.
    /// </summary>
    public string? Password { get; set; }

    /// <summary>
    /// Gets or sets the Host of the MailSettings.
    /// </summary>
    public string? Host { get; set; }

    /// <summary>
    /// Gets or sets the Port of the MailSettings.
    /// </summary>
    public int Port { get; set; }

    /// <summary>
    /// Gets or sets the UseSSL of the MailSettings.
    /// </summary>
    public bool UseSSL { get; set; }

    /// <summary>
    /// Gets or sets the UseStartTls of the MailSettings.
    /// </summary>
    public bool UseStartTls { get; set; }
}
