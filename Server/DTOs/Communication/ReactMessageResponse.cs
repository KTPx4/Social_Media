namespace Server.DTOs.Communication
{
    public class ReactMessageResponse
    {
        public Guid Id { get; set; }
        public Guid? SenderId { get; set; }

        public Guid ConversationId { get; set; }
        public Guid MessageId { get; set; }
        public string React { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool isDelete { get; set; } = false;

    }
}
