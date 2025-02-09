namespace Server.DTOs.Communication
{
    public class ReactMessageModel
    {
        public Guid SenderId { get; set; }
        public Guid MessageId { get; set; }      

        public string React { get; set; }
    }

}
