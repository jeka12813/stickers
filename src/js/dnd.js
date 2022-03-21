class DnD {

  position = {
    top: 'auto',
    left: 'auto'
  }

  shifts = {
    x: 0,
    y: 0
  }


  constructor (element) {
    this.element = element
    this.id=""

    this.init()
  }

  init () {
    this.handleMouseMove = this.handleMouseMove.bind(this)

    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.element.addEventListener('mouseup', this.handleMouseUp.bind(this))
  }

  handleMouseDown ({ clientX, clientY,target }) {
    this.id=target.dataset.id

    document.addEventListener('mousemove', this.handleMouseMove)

    this.calcShifts(clientX, clientY)
    this.setPosition(clientX, clientY)
  }

  handleMouseMove ({ clientX, clientY }) {
    this.setPosition(clientX, clientY)
  }

  handleMouseUp ({ clientX, clientY }) {
    document.removeEventListener('mousemove', this.handleMouseMove)
    this.setPosition(clientX, clientY)
  }

  calcShifts (x, y) {
    const rect = this.element.getBoundingClientRect()
    const { left, top } = rect

    this.shifts.x = x - left
    this.shifts.y = y - top
  }

  setPosition (left, top) {
    this.position.left = left - this.shifts.x
    this.position.top= top - this.shifts.y
    let clientX=this.position.left
    let clientY=this.position.top
    let id=this.id

    const customEvent = new CustomEvent('dnd.setPositionCard', {
      detail: { clientX,clientY,id }
    })
    window.dispatchEvent(customEvent)

    this.element.style.top = this.position.top + 'px'
    this.element.style.left = this.position.left + 'px'
  }
}

export { DnD }
