using StaffService.Data;
using StaffService.Models;

namespace StaffService.Repositories
{
    public class StaffRepository : IStaffRepository
    {
        private readonly ApplicationDbContext context;

        public StaffRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        // Get All Staff
        public List<Staff> GetAllStaff()
        {
            return context.Staffs.ToList();
        }

        // Get Staff By Id
        public Staff GetStaffById(int id)
        {
            return context.Staffs.Find(id);
        }

        // Add Staff
        public void AddStaff(Staff staff)
        {
            context.Staffs.Add(staff);
            context.SaveChanges();
        }

        // Update Staff
        public void UpdateStaff(Staff staff)
        {
            context.Staffs.Update(staff);
            context.SaveChanges();
        }

        // Delete Staff
        public void DeleteStaff(int id)
        {
            Staff staff = context.Staffs.Find(id);

            if (staff != null)
            {
                context.Staffs.Remove(staff);
                context.SaveChanges();
            }
        }
    }
}