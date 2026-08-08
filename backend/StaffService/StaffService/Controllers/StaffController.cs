using Microsoft.AspNetCore.Mvc;
using StaffService.DTOs;
using StaffService.Models;
using StaffService.Services;

namespace StaffService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly IStaffService service;
        private readonly IWebHostEnvironment environment;

        public StaffController(IStaffService service, IWebHostEnvironment environment)
        {
            this.service = service;
            this.environment = environment;
        }

        // GET ALL STAFF
        [HttpGet]
        public IActionResult GetAllStaff()
        {
            return Ok(service.GetAllStaff());
        }

        // GET STAFF BY ID
        [HttpGet("{id}")]
        public IActionResult GetStaffById(int id)
        {
            var staff = service.GetStaffById(id);

            if (staff == null)
                return NotFound("Staff Not Found");

            return Ok(staff);
        }

        // ADD STAFF
        [HttpPost]
        public async Task<IActionResult> AddStaff([FromForm] AddStaffDto dto)
        {
            string imagePath = "";

            // Save Image
            if (dto.Image != null)
            {
                string folder = Path.Combine(environment.WebRootPath, "images");

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                string fileName = Guid.NewGuid().ToString() +
                                  Path.GetExtension(dto.Image.FileName);

                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                imagePath = "/images/" + fileName;
            }

            Staff staff = new Staff
            {
                Name = dto.Name,
                Role = dto.Role,
                Department = dto.Department,
                Email = dto.Email,
                Phone = dto.Phone,
                Status = dto.Status,
                ImageUrl = imagePath
            };

            service.AddStaff(staff);

            return Ok(staff);
        }

        // UPDATE STAFF
        [HttpPut("{id}")]
        public IActionResult UpdateStaff(int id, Staff staff)
        {
            if (id != staff.StaffId)
                return BadRequest();

            service.UpdateStaff(staff);

            return Ok("Staff Updated Successfully");
        }

        // DELETE STAFF
        [HttpDelete("{id}")]
        public IActionResult DeleteStaff(int id)
        {
            service.DeleteStaff(id);

            return Ok("Staff Deleted Successfully");
        }
    }
}