import { KanbanDataDTO } from '../dto/kanban.dto';

export function FormatKanbanColumns(data: KanbanDataDTO[]) {
  const columns = [
    {
      id: 1,
      title: 'Backlog',
      status: 'BACKLOG',
      items: data.filter((ki) => ki.status === 'BACKLOG') || [],
    },
    {
      id: 2,
      title: 'A fazer',
      status: 'AFAZER',
      items: data.filter((ki) => ki.status === 'AFAZER') || [],
    },
    {
      id: 3,
      title: 'Em progresso',
      status: 'ANDAMENTO',
      items: data.filter((ki) => ki.status === 'ANDAMENTO') || [],
    },
    {
      id: 4,
      title: 'Concluído',
      status: 'CONCLUIDO',
      items: data.filter((ki) => ki.status === 'CONCLUIDO') || [],
    },
  ];

  return columns;
}
