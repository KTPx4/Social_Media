namespace Server.DTOs.Communication
{
    public class MessageReactResponse
    {
        public Guid MessageId { get; set; }
        public Guid UserId { get; set; }
        public string React { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
