let itemCount = 0

export class TodoItem {
  id: number

  constructor(public description: string, public priority: number) {
    itemCount++
    this.id = itemCount
  }

}