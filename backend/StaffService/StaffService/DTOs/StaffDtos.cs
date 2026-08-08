namespace StaffService.DTOs
{
    // Used while adding a staff
    public class StaffCreateDto
    {
        public string Name { get; set; }

        public string Role { get; set; }

        public string Department { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Status { get; set; }

        public string ImageUrl { get; set; }
    }

    // Used while updating a staff
    public class StaffUpdateDto
    {
        public string Name { get; set; }

        public string Role { get; set; }

        public string Department { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Status { get; set; }

        public string ImageUrl { get; set; }
    }

    // Used while returning data
    public class StaffResponseDto
    {
        public int StaffId { get; set; }

        public string Name { get; set; }

        public string Role { get; set; }

        public string Department { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Status { get; set; }

        public string ImageUrl { get; set; }
    }
}