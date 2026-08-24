namespace BlogApp_BackEnd.Dto
{
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public string Username { get; set; }

        public bool IsAdmin {  get; set; }
    }
}