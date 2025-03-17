/* shell.component.ts */
import { Component, Input, OnInit, Injector, Inject, Type } from '@angular/core';
import { AngularViewComponent } from './angular-view.component';
// Предположим, что WorkspaceComponent и ItemEditComponent уже созданы и зарегистрированы
// Импортируем их, а также необходимые глобальные объекты из state (gridState, confirmEdit, itemForm, targetItem)
// Импортируем список компонентов, сопоставляемых с типом задачи (например, Map<string, Type<any>>)
import { gridState, confirmEdit, itemForm, targetItem } from '../../state/grid-state';
import components from './components'; // например, Map<string, Type<any>>

@Component({
  selector: 'app-shell',
  template: `
    <!-- Workspace Icons -->
    <app-workspace [items]="gridState.items" [lists]="gridState.lists"></app-workspace>

    <!-- UI‑Scaled Layer -->
    <ui-orientbox id="ui-layer" class="ui-layer" orient="0" style="background-color: transparent;">
      <!-- Apps Part -->
      <ng-container *ngFor="let task of tasks">
        <ui-frame [attr.data-highlight]="2" [attr.data-chroma]="0.1" data-scheme="solid"
                  [id]="task.id.replace('#','')">
          <div style="justify-self: start; text-align: start; padding-inline: 1rem;" slot="ui-title-bar">
            {{ task.desc.label }}
          </div>
          <!-- Динамически загружаем либо компонент из components, либо AngularViewComponent по умолчанию -->
          <ng-container *ngComponentOutlet="getComponent(task); injector: createInjector(task)"></ng-container>
        </ui-frame>
      </ng-container>

      <!-- Item Edit -->
      <app-item-edit [loadState]="targetItem" [confirmState]="confirmEdit" [form]="itemForm"></app-item-edit>

      <!-- Taskbar -->
      <ui-taskbar [tasks]="tasks">
        <ng-container *ngFor="let task of tasks">
          <ui-task [taskId]="task.id" [desc]="task.desc">
            <ui-icon [icon]="task.desc.icon"></ui-icon>
          </ui-task>
        </ng-container>
      </ui-taskbar>

      <!-- Navbar (Mobile Only) -->
      <ui-navbar></ui-navbar>

      <!-- Context Menu Modal -->
      <ui-modal type="contextmenu" id="contextmenu"
                style="display: inline-grid; padding: 0.25rem;
                       grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);">
      </ui-modal>

      <!-- Calendar Modal -->
      <ui-modal type="popup" data-name="calendar">
        <ui-calendar></ui-calendar>
      </ui-modal>
    </ui-orientbox>
  `
})
export class ShellComponent implements OnInit {
  // Принимаем список задач через Input (например, Map или массив)
  @Input() tasksList: any;
  // Локальное хранилище задач в виде массива
  tasks: any[] = [];

  // Экспортируем внешнее состояние, чтобы использовать его в привязках
  gridState = gridState;
  confirmEdit = confirmEdit;
  itemForm = itemForm;
  targetItem = targetItem;
  // Список компонентов для динамического выбора: ожидается, что components имеет тип Map<string, Type<any>>
  components = components;

  ngOnInit() {
    this.updateTasks();
    // Если tasksList может обновляться, то можно подписаться на его обновления, если он поддерживает подписку
    if (this.tasksList && typeof this.tasksList.subscribe === 'function') {
      this.tasksList.subscribe(() => {
        this.updateTasks();
      });
    }
  }

  updateTasks() {
    // Если tasksList – это Map, преобразуем в массив; если массив – оставляем как есть
    if (this.tasksList && typeof this.tasksList.values === 'function') {
      this.tasks = Array.from(this.tasksList.values());
    } else if (Array.isArray(this.tasksList)) {
      this.tasks = this.tasksList;
    }
  }

  // Возвращает компонент для отображения конкретной задачи:
  // Если в components содержится компонент для task.args.type, то возвращаем его, иначе – AngularViewComponent
  getComponent(task: any): Type<any> {
    return this.components.get(task.args?.type) || AngularViewComponent;
  }

  // Создание инжектора, который передаст входные данные для динамически загружаемого компонента.
  // Здесь мы передаем id и args, чтобы AngularViewComponent (или другой компонент) мог их использовать.
  createInjector(task: any) {
    return Injector.create({
      providers: [
        { provide: 'id', useValue: task.id },
        { provide: 'args', useValue: task.args }
      ]
    });
  }
}
