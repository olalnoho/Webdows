const menubtn = document.getElementById('menubtn')
const menu = document.getElementById('menu')
const clock = document.getElementById('clock')
const date = document.getElementById('date')
const content = document.getElementById('content')


/*
   --- MENU BAR TOGGLE ---
*/

function toggleMenu() {
   menu.style.visibility =
      menu.style.visibility == 'visible' ? 'hidden' : 'visible'

   menu.style.opacity
      = menu.style.opacity == '1' ? '0' : '1'
   // Opacity is used for CSS transition-effect.
}

menu.addEventListener('click', e => {
   // To stop it from closing the menu when clicking inside it.
   e.stopPropagation()
})

menubtn.addEventListener('click', toggleMenu)

content.addEventListener('click', function (e) {
   menu.style.visibility = 'hidden'
   menu.style.opacity = 0

   if (painting) {
      closeDrawWindow()
      minimizePaint()
   }
})


/*
   --- CLOCK ---
*/

function getTime() {
   const time = new Date()
   const seconds = formatDateFunc(time.getSeconds.bind(time))
   const minutes = formatDateFunc(time.getMinutes.bind(time))
   const hours = formatDateFunc(time.getHours.bind(time))
   clock.innerHTML = hours + ':' + minutes + ':' + seconds
}

function getDate() {
   const thedate = new Date()
   const month = formatDateFunc(thedate.getMonth.bind(thedate))
   const day = formatDateFunc(thedate.getDay.bind(thedate))
   date.innerHTML = thedate.getFullYear() + '-' + month + '-' + day
}

function formatDateFunc(func) {
   return func() < 10 ? '0' + func().toString() : func()
}

// Initial load of clock and calendar.
getDate()
getTime()

// Updates every second
setInterval(getTime, 1000)
// Updates once a day -- definitely unnecessary, but hey...
setInterval(getDate, 86400000)


/*
   --- MENU BAR LINKS ---
*/

// Menu Links

const paint = document.getElementById('paint')
const drawwindow = document.getElementById('drawwindow')
const toolbar = document.getElementById('toolbar')
const closebtn = document.getElementById('close')
const colorpickers = document.querySelectorAll('.paint__color')
const brushSize = document.getElementById('brushValue')
const inc_brush = document.getElementById('inc_brush')
const dec_brush = document.getElementById('dec_brush')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let activeColor = 'black'
let painting = false

function closeDrawWindow() {
   drawwindow.style.visibility = 'hidden'
   drawwindow.style.display = 'none'
   content.style.filter = ''
   painting = false
   brushSize.textContent = 10
}

function openDrawWindow(elem, display) {
   elem.style.display = display
   elem.style.visibility = 'visible'
   content.style.filter = 'blur(5px)'
   painting = true
}

// Inc and dec brushsize
inc_brush.addEventListener('click', e => {
   brushSize.textContent = +brushSize.textContent + 1
})

dec_brush.addEventListener('click', e => {
   if (+brushSize.textContent <= 1) return
   brushSize.textContent = +brushSize.textContent - 1
})

// Assign colors to the color buttons
colorpickers.forEach(function (color) {
   color.addEventListener('click', function (e) {
      activeColor = this.attributes[1].name
      ctx.strokeStyle = activeColor
   })
})

paint.addEventListener('click', e => {
   openDrawWindow(drawwindow, 'flex')
   getCanvasDim()
   toggleMenu()
})

const getPos = function (cx, cy) {
   const rect = canvas.getBoundingClientRect()
   const x = cx - rect.left
   const y = cy - rect.top
   return [x, y]
}

function getCanvasDim() {
   const imageData = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight)
   canvas.height = drawwindow.offsetHeight - toolbar.offsetHeight
   canvas.width = drawwindow.offsetWidth
   ctx.putImageData(imageData, 0, 0)
}

/*  --- Drawing on the canvas --- */
window.addEventListener('resize', () => {
   if (painting) {
      getCanvasDim()
   }
})

canvas.addEventListener('mousedown', function (e) {
   // draw call here for dotting
   draw(e)
   canvas.addEventListener('mousemove', draw)
})

canvas.addEventListener('mouseup', function (e) {
   // beginPath call here for ending line
   ctx.beginPath()
   canvas.removeEventListener('mousemove', draw)
})

canvas.addEventListener('touchstart', function (e) {
   canvas.addEventListener('touchmove', draw)
})

canvas.addEventListener('touchend', function (e) {
   ctx.beginPath()
   canvas.removeEventListener('touchmove', draw)
})

function draw(e) {

   let clientX = e.touches ? e.touches[0].clientX : e.clientX
   let clientY = e.touches ? e.touches[0].clientY : e.clientY

   const [x, y] = getPos(clientX, clientY)

   ctx.lineCap = 'round'
   ctx.lineWidth = +brushSize.textContent

   ctx.lineTo(x, y)
   ctx.strokeStyle = activeColor
   ctx.stroke()
   ctx.beginPath()
   ctx.moveTo(x, y)
}

/*
 -- MINIMIZE --
*/

const minimized = {}
const taskbar = document.getElementById('minimized')
const minimizewindow = document.getElementById('minimizewindow')

minimizewindow.addEventListener('click', e => {
   minimizePaint()
})

function minimizePaint() {
   minimized.Paint = drawwindow
   refreshMini()
   closeDrawWindow()
}

closebtn.addEventListener('click', e => {
   painting = false
   delete minimized.Paint
   refreshMini()
   closeDrawWindow()
   ctx.clearRect(0, 0, canvas.width, canvas.height);
})

function refreshMini() {
   taskbar.innerHTML = ''
   Object.keys(minimized).forEach(item => {
      const elem = document.createElement('h3')
      elem.innerHTML = item
      elem.addEventListener('click', function () {
         openDrawWindow(minimized[item], 'flex')
         getCanvasDim()
      })
      taskbar.appendChild(elem)
   })
}