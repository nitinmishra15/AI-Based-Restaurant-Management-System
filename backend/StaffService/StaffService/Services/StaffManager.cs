using StaffService.Models;
using StaffService.Repositories;

namespace StaffService.Services
{
    public class StaffManager : IStaffService
    {
        private readonly IStaffRepository repository;

        public StaffManager(IStaffRepository repository)
        {
            this.repository = repository;
        }

        public List<Staff> GetAllStaff()
        {
            return repository.GetAllStaff();
        }

        public Staff GetStaffById(int id)
        {
            return repository.GetStaffById(id);
        }

        public void AddStaff(Staff staff)
        {
            repository.AddStaff(staff);
        }

        public void UpdateStaff(Staff staff)
        {
            repository.UpdateStaff(staff);
        }

        public void DeleteStaff(int id)
        {
            repository.DeleteStaff(id);
        }
    }
}