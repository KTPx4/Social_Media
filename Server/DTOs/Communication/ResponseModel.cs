namespace Server.DTOs.Communication
{
    public class ResponseModel<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T? Data { get; set; }

        public static ResponseModel<T> Ok(T data, string message = "Success")
        {
            return new ResponseModel<T> { Success = true, Message = message, Data = data };
        }

        public static ResponseModel<T> BadRequest(string message)
        {
            return new ResponseModel<T> { Success = false, Message = message };
        }
    }
}
    