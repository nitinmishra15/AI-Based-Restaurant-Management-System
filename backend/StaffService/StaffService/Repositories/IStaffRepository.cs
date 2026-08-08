using StaffService.Models;

namespace StaffService.Repositories
{
    public interface IStaffRepository
    {
        List<Staff> GetAllStaff();

        Staff GetStaffById(int id);

        void AddStaff(Staff staff);

        void UpdateStaff(Staff staff);

        void DeleteStaff(int id);
    }
}