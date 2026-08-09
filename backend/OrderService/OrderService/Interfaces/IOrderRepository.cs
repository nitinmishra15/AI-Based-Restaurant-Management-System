using OrderService.Models;

namespace OrderService.Interfaces
{
    // order repository interface
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAll();

        Task<Order?> GetById(int id);

        Task<Order> Create(Order order);

        Task Update(Order order);

        Task Delete(int id);

        Task Save();
    }
}
