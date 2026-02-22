import { KanbanDataDTO } from '../dto/kanban.dto';

export function FormatKanbanColumns(data: KanbanDataDTO[]) {
  const columns = [
    {
      id: 'BACKLOG',
      title: 'Backlog',
      items: data.filter((ki) => ki.status === 'BACKLOG') || [],
    },
    {
      id: 'AFAZER',
      title: 'A fazer',
      items: data.filter((ki) => ki.status === 'AFAZER') || [],
    },
    {
      id: 'ANDAMENTO',
      title: 'Em progresso',
      items: data.filter((ki) => ki.status === 'ANDAMENTO') || [],
    },
    {
      id: 'CONCLUIDO',
      title: 'Concluído',
      items: data.filter((ki) => ki.status === 'CONCLUIDO') || [],
    },
  ];

  return columns;
}
