import { KanbanDataDTO } from '../dto/kanban.dto';
import { KanbanDataSchema } from '../plataform-tools.schema/kanban.schema';
import { GetDaysCount } from './get-remaining-days';

export function FormatKanbanColumns(data: KanbanDataDTO[]) {
  const kanbanWithDaysDue = data.map((m) => {
    return {
      ...m,
      dayCountMessage: DefineDaysLeft(m),
    };
  }) as KanbanDataSchema[];

  const columns = [
    {
      id: 'BACKLOG',
      title: 'Backlog',
      items: kanbanWithDaysDue.filter((ki) => ki.status === 'BACKLOG') || [],
    },
    {
      id: 'AFAZER',
      title: 'A fazer',
      items: kanbanWithDaysDue.filter((ki) => ki.status === 'AFAZER') || [],
    },
    {
      id: 'ANDAMENTO',
      title: 'Em progresso',
      items: kanbanWithDaysDue.filter((ki) => ki.status === 'ANDAMENTO') || [],
    },
    {
      id: 'CONCLUIDO',
      title: 'Concluído',
      items: kanbanWithDaysDue.filter((ki) => ki.status === 'CONCLUIDO') || [],
    },
  ];

  return columns;
}

export function DefineDaysLeft(data: KanbanDataDTO) {
  const exceptionDue = ['CONCLUIDO'];
  if (!exceptionDue.includes(data.status)) {
    const daysCount = GetDaysCount(data.dueDate, true);

    let message = '';

    if (daysCount < 0) message = `Expirou há ${daysCount * -1} dia(s)`;

    if (daysCount === 0) message = 'Vence hoje!';

    if (daysCount === 1) message = 'Vence amanhã';

    if (daysCount > 1) message = `Restam ${daysCount} dias`;

    return message;
  }
}
