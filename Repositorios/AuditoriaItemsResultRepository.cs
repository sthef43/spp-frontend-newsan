using Microsoft.EntityFrameworkCore;
using SPP.Business.DBContext;
using SPP.Business.EntitiesMantenimiento;
using SPP.Data.InterfaceRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SPP.Data.Repositories
{
	public class AuditoriaItemsResultRepository : GenericRepository<AuditoriaItemsResult>, IAuditoriaItemsResultRepository
    {

		private ControlmantenimientoContext _context;
		private DbSet<AuditoriaItemsResult> _entity;

		public AuditoriaItemsResultRepository(ControlmantenimientoContext context) : base(context)
		{
			_context = context;
			_entity = context.Set<AuditoriaItemsResult>();
		}

		public async Task<List<AuditoriaItemsResult>> MultiPutItemsResult(List<AuditoriaItemsResult> entidades)
		{
			try
			{	
				List<AuditoriaItemsResult> listasJuntas = new List<AuditoriaItemsResult>();
				List<AuditoriaItemsResult> listaParaAñadir = new List<AuditoriaItemsResult>();
				var data = entidades;

				var dataActualizar = data.Where((e) => e.Id != 0).ToList();
				var dataNueva = data.Where((e) => e.Id == 0).ToList();

				var queryItemsActualizar = await _entity.Where((e) => dataActualizar.Select((f) => f.Id).Contains(e.Id)).ToListAsync();

				if (queryItemsActualizar.Count > 0)
				{
                    foreach (var item in queryItemsActualizar)
                    {
                        var dataItem = dataActualizar.FirstOrDefault(x => x.Id == item.Id);
                        if (dataItem != null)
                        {
                            item.AuditoriaNivelItemId = dataItem.AuditoriaNivelItemId;
                            item.Nombre = dataItem.Nombre;
                            item.LastModifiedDate = DateTime.Now;
                            item.Deleted = false;
                        }
                    }
                }

				if (dataNueva.Count > 0)
				{
                    int grupoId = queryItemsActualizar.Count > 0 ? queryItemsActualizar[0].AuditoriaGrupoItemsResultId : dataNueva[0].AuditoriaGrupoItemsResultId;

                    foreach (var item in dataNueva)
                    {
                        AuditoriaItemsResult nuevoItem = new AuditoriaItemsResult
                        {
                            Nombre = item.Nombre,
                            LastModifiedDate = DateTime.Now,
                            Deleted = false,
                            CreatedDate = DateTime.Now,
                            AuditoriaGrupoItemsResultId = item.AuditoriaGrupoItemsResultId != 0 ? item.AuditoriaGrupoItemsResultId : grupoId,
                            AuditoriaNivelItemId = item.AuditoriaNivelItemId,
                            Descripcion = "",
                        };
                        listaParaAñadir.Add(nuevoItem);
                    }
                    _context.AuditoriaItemsResult.AddRange(listaParaAñadir);
                }

				_context.AuditoriaItemsResult.UpdateRange(queryItemsActualizar);
				_context.SaveChanges();

				listasJuntas.AddRange(queryItemsActualizar);
				listasJuntas.AddRange(listaParaAñadir);

				return listasJuntas;
            }
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
		}
	}
}
