using StaffService.Models;

namespace StaffService.Services
{
    public interface IStaffService
    {
        List<Staff> GetAllStaff();

        Staff GetStaffById(int id);

        void AddStaff(Staff staff);

        void UpdateStaff(Staff staff);

        void DeleteStaff(int id);
    }
}