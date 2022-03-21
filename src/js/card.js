import { nanoid } from 'nanoid'
import { DnD } from './dnd'

class Card {
  storage = localStorage.getItem('data')
  parseStorage = this.storage ? JSON.parse(this.storage) : []
  data = this.parseStorage
  constructor() {
    this.formColorElement = document.querySelector('#formColor')
    this.buttonCreateElement = document.querySelector('#btnCreate')
    this.containerElement = document.querySelector('.container')

    this.init()
  }

  init() {
    this.formColorElement.addEventListener('submit', this.handleClickButtonCreateCard.bind(this))
    this.containerElement.addEventListener('click', this.handleRemoveCard.bind(this))
    this.containerElement.addEventListener('dblclick', this.handleEditCard.bind(this))
    this.containerElement.addEventListener('submit', this.handleSubmitEditCard.bind(this))
    window.addEventListener('dnd.setPositionCard', this.handleSetPositionCard.bind(this))

    window.addEventListener('beforeunload', () => {
      const string = JSON.stringify(this.data)
      localStorage.setItem('data', string)
    })
    document.addEventListener('DOMContentLoaded', () => this.render(this.data))
  }

  handleSetPositionCard ( {detail} ){
    const { clientX,clientY,id } = detail
    this.data.forEach((item) => {
      if(item.id==id){
        console.log(item)
        item.top=clientY
        item.left=clientX
      }
  })
  }

  handleClickButtonCreateCard () {
    const card = {
      id: nanoid(),
      content: 'Добавьте заметку',
      top: 'auto',
      left: 'auto'
    }

    const formData = new FormData(this.formColorElement)
    for (const [name, value] of formData) {
      card.color = value
    }

    this.data.push(card)
    this.render()
  }

  handleEditCard (event) {
    const { target } = event
    if (target.dataset.role != 'edit') return
    let parent = target.closest('.card')
    parent.classList.add('edited')
  }

  handleSubmitEditCard (event) {
    event.preventDefault()
    const { target } = event
    const textareaElement = target.querySelector('textarea[name="title"]')
    const { value } = textareaElement
    const { id } = target.dataset
    this.data.forEach((item) => {
      if (item.id == id) {
        console.log(item)
        item.content = value
        .replace(/^\#\s(.+)/gim, '<h1>$1</h1>')
                .replace(/^\#{2}\s(.+)/gim, '<h2>$1</h2>')
                .replace(/^\#{3}\s(.+)/gim, '<h3>$1</h3>')
                .replace(/^\#{4}\s(.+)/gim, '<h4>$1</h4>')
                .replace(/\*\*(.+?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\~\~(.+?)\~\~/gim, '<strike>$1</strike>')
                .replace(/(\[(.+?)\])(\((.+?)\))/gim, '<a href="$4" target="_blank">$2</a>')
                .replace(/\`(.+?)\`/gim, '<code>$1</code>')
                .replace(/\-{3}\s/gim, '<hr>')
                .replace(/\[\+\+(.+?)\+\+\]/gim, '<span class="text-success">$1</span>')
                .replace(/\[\-\-(.+?)\-\-\]/gim, '<span class="text-danger">$1</span>')
                .replace(/^\-\s(.+)/gim, '<li>$1</li>')
                .replace(/(<li>(.+)<li>)/gim, '<ul>$1</ul>')
      }
    })
    let parent = target.closest('.card')
    parent.classList.remove('edited')
    this.render(this.render)
  }

  buildCardElement(data) {
    console.log(data)
    const cardElement = document.createElement('div')
    cardElement.classList.add('card')
    cardElement.setAttribute('data-id', data.id)
    cardElement.setAttribute('data-role', 'edit')
    cardElement.style.top = data.top+"px"
    cardElement.style.left = data.left+"px"
    cardElement.style.background = data.color

    const temlateCard = `
      <button class="btnRemove"  data-id="${data.id}" data-role="remove">
      🗑
      </button>
      <div data-role="edit" data-id="${data.id}" class="card__item">
      ${data.content}
      </div>
      <form class="form-edit" data-id="${data.id}">
        <textarea name="title" type="text">
        ${data.content}
        </textarea>
        <button type="submit" data-role="save" id="btnSave">
        Сохранить
        </button>
      </form>
    `
    cardElement.innerHTML = temlateCard
    new DnD(cardElement)
    return cardElement
  }

  handleRemoveCard (event) {
    const { target } = event
    if (target.dataset.role != 'remove') return
    const { id } = target.dataset
    this.data.forEach((item, index) => {
      if (item.id == id) {
        this.data.splice(index, 1)
      }
    })
    this.render(this.data)
  }

  render(data) {
    this.containerElement.innerHTML = ''
    this.data.forEach(item => {
      const cardElement = this.buildCardElement(item)
      this.containerElement.append(cardElement)
    })
  }

}

export { Card }
