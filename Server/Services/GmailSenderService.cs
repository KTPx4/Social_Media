using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Gmail.v1;
using Google.Apis.Services;
using System.Net.Mail;
using System.Text;

namespace Server.Services
{
    public class GmailSenderService
    {
        private readonly string _ApplicationName;
        private readonly string _ClientId;
        private readonly string _ClientSecret;
        private readonly string _RefreshToken;
        private readonly string _MyEmail;
        private readonly string _NameEmail;
        

        public GmailSenderService(IConfiguration configuration)
        {
            var gmailSettings = configuration.GetSection("GmailSettings");
            _ApplicationName = gmailSettings["ApplicationName"];
            _ClientId = gmailSettings["ClientId"];
            _ClientSecret = gmailSettings["ClientSecret"];
            _RefreshToken = gmailSettings["RefreshToken"];
            _MyEmail = gmailSettings["MyEmail"];
            _NameEmail = gmailSettings["NameEmail"];

            
        }
        
        public async Task SendEmail(string toEmail, string Subject, string Body)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            var credential = await GetCredentialAsync();

            var service = new GmailService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = _ApplicationName,
            });

            var msg = new AE.Net.Mail.MailMessage
            {
                Subject = Subject,
                Body = Body,
                From = new MailAddress(_MyEmail, _NameEmail),

            };
            msg.ContentType = "text/html";
            msg.To.Add(new MailAddress(toEmail));
            msg.ReplyTo.Add(msg.From);
            var msgStr = new StringWriter();
            msg.Save(msgStr);

            var result = service.Users.Messages.Send(new Google.Apis.Gmail.v1.Data.Message
            {
                Raw = Base64UrlEncode(msgStr.ToString())
            }, "me").Execute();

            Console.WriteLine("Message ID: " + result.Id);
        }

        private async Task<UserCredential> GetCredentialAsync()
        {
            var clientSecrets = new ClientSecrets
            {
                ClientId = _ClientId,
                ClientSecret = _ClientSecret
            };

            var tokenResponse = await new AuthorizationCodeFlow(
                new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = clientSecrets
                })
                .RefreshTokenAsync(_ClientId, _RefreshToken, new System.Threading.CancellationToken());

            return new UserCredential(new AuthorizationCodeFlow(
                new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = clientSecrets
                }),
                "user",
                tokenResponse);
        }

        private static string Base64UrlEncode(string input)
        {
            var inputBytes = Encoding.Default.GetBytes(input);
            return Convert.ToBase64String(inputBytes).Replace('+', '-').Replace('/', '_').Replace("=", "");
        }


        public async Task SendEmail(string toEmail, string subject, string templateFileName, Dictionary<string, string> placeholders)
        {
            // Đường dẫn đầy đủ tới file template
            string templatePath = GetTemplatePath(templateFileName);

            if (!File.Exists(templatePath))
            {
                throw new FileNotFoundException($"Template file '{templateFileName}' not found in{templatePath}");
            }

            // Đọc file HTML
            string body = File.ReadAllText(templatePath);

            // Thay thế các placeholder trong HTML
            foreach (var placeholder in placeholders)
            {
                body = body.Replace($"{{{{{placeholder.Key}}}}}", placeholder.Value);
            }

            // Tương tự hàm gửi email đã có
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            var credential = await GetCredentialAsync();
            var service = new GmailService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = _ApplicationName,
            });

            var msg = new AE.Net.Mail.MailMessage
            {
                Subject = subject,
                Body = body,
                From = new MailAddress(_MyEmail, _NameEmail),
            };
            msg.ContentType = "text/html";
            msg.To.Add(new MailAddress(toEmail));
            msg.ReplyTo.Add(msg.From);
            var msgStr = new StringWriter();
            msg.Save(msgStr);

            var result = await service.Users.Messages.Send(new Google.Apis.Gmail.v1.Data.Message
            {
                Raw = Base64UrlEncode(msgStr.ToString())
            }, "me").ExecuteAsync();

            Console.WriteLine("Message ID: " + result.Id);
        }
        public static string GetTemplatePath(string fileName)
        {
            string projectRoot = Directory.GetParent(AppContext.BaseDirectory)?.Parent?.Parent?.Parent?.FullName;
            if (projectRoot == null)
            {
                throw new InvalidOperationException("Cannot locate project root directory.");
            }

            string templateFolder = Path.Combine(projectRoot, "Templates");
            return Path.Combine(templateFolder, fileName);
        }

    }
}
