using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using OrderService.Data;
using OrderService.Interfaces;
using OrderService.Models;

namespace OrderService.Repositories
{
    // order repository implementation
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;
        private static bool _dbCreatedChecked = false;
        private static readonly object _dbLock = new object();

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // get all orders
        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _context.Orders.ToListAsync();
        }

        // find order by id
        public async Task<Order?> GetById(int id)
        {
            return await _context.Orders.FindAsync(id);
        }

        // create new order
        public async Task<Order> Create(Order order)
        {
            // check database and tables existence
            // CheckDatabaseAndTableCreated();

            await _context.Orders.AddAsync(order);
            return order;
        }

        // update order
        public async Task Update(Order order)
        {
            _context.Orders.Update(order);
            await Task.CompletedTask;
        }

        // delete order
        public async Task Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
            }
        }

        // save changes
        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        // check database and tables
        private void CheckDatabaseAndTableCreated()
        {
            if (!_dbCreatedChecked)
            {
                lock (_dbLock)
                {
                    if (!_dbCreatedChecked)
                    {
                        var creator = _context.Database.GetService<IRelationalDatabaseCreator>();
                        
                        // create db if not exists
                        if (!creator.Exists())
                        {
                            try
                            {
                                creator.Create();
                            }
                            catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 5170)
                            {
                                // SQL Server error 5170: database files already exist on disk but DB is not in SQL Server.
                                // Clean up the orphaned database files from the user folder and retry.
                                var userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
                                string[] filesToDelete = {
                                    System.IO.Path.Combine(userProfile, "QrDiningOrderDb.mdf"),
                                    System.IO.Path.Combine(userProfile, "QrDiningOrderDb_log.ldf"),
                                    System.IO.Path.Combine(userProfile, "OrderDb.mdf"),
                                    System.IO.Path.Combine(userProfile, "OrderDb_log.ldf")
                                };
                                
                                foreach (var file in filesToDelete)
                                {
                                    try
                                    {
                                        if (System.IO.File.Exists(file))
                                        {
                                            System.IO.File.Delete(file);
                                        }
                                    }
                                    catch
                                    {
                                        // Ignore any file deletion errors (e.g. if files are locked)
                                    }
                                }

                                // Retry creation
                                creator.Create();
                            }
                        }
                        
                        // create tables if not exist
                        if (!creator.HasTables())
                        {
                            creator.CreateTables();
                        }
                        
                        _dbCreatedChecked = true;
                    }
                }
            }
        }
    }
}
