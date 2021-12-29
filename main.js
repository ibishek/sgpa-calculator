import './style.css'

window.onload = function () {
  document
    .querySelector('.add-new')
    .addEventListener('click', addNewSubjectElement)
  document
    .querySelector('.calculate')
    .addEventListener('click', calculateSemesterEndGradePointAverage)

  function addNewSubjectElement() {
    const form = document.querySelector('.form')
    let mainDiv = document.createElement('div')
    mainDiv.classList.add('form-group')
    mainDiv.appendChild(
      createInputType('subject', 'Enter subject for identification'),
    )
    mainDiv.appendChild(createInputType('credit', 'Enter credit hour*'))
    mainDiv.appendChild(createSelectElement())
    mainDiv.appendChild(createCloseElement())
    form.appendChild(mainDiv)
    // attach close event on newly created element
    let allCloseButton = document.querySelectorAll('.close')
    allCloseButton.forEach((element) => {
      element.addEventListener('click', destroyElement)
    })
  }

  function createInputType(name, placeholder) {
    let inputType = document.createElement('input')
    Object.assign(inputType, {
      type: 'text',
      name,
      id: name,
      placeholder,
    })
    return inputType
  }

  function createSelectElement() {
    let selectElement = document.createElement('select')
    selectElement.setAttribute('name', 'grade')
    selectElement.setAttribute('id', 'grade')
    let selectPlaceholder = document.createElement('option')
    selectPlaceholder.setAttribute('selected', 'selected')
    selectPlaceholder.setAttribute('disabled', 'disabled')
    selectPlaceholder.text = 'Select Your Grade*'
    selectElement.add(selectPlaceholder)
    let letterGrades = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F']
    letterGrades.map((eachLetterGrade) => {
      let createOption = document.createElement('option')
      createOption.value = eachLetterGrade
      createOption.text = eachLetterGrade
      selectElement.add(createOption)
    })
    return selectElement
  }

  function createCloseElement() {
    let closeButton = document.createElement('button')
    closeButton.setAttribute('type', 'button')
    closeButton.classList.add('close')
    closeButton.innerHTML = '&times;'
    return closeButton
  }

  function destroyElement(event) {
    event.target.parentNode.remove()
  }

  function calculateSemesterEndGradePointAverage() {
    let preparedData = []
    let errorEncountered = false
    let allFormGroupElements = document.querySelectorAll('.form-group')
    allFormGroupElements.forEach((element) => {
      let subject = element.querySelector('input#subject')
      let credit = element.querySelector('input#credit')
      let grade = element.querySelector('select#grade')
      preparedData.push({
        subject: subject.value,
        credit: parseInt(credit.value),
        letterGrade: grade.value.toUpperCase(),
        grade: letterGradeToGradeValueConversion(grade.value.toUpperCase()),
      })
    })
    let totalCredit = preparedData.reduce(
      (currentValue, data) => currentValue + data.credit,
      0,
    )
    if (Number.isNaN(totalCredit)) {
      errorEncountered = true
    }
    let mulCreditAndGradePoint = 0
    preparedData.forEach((data) => {
      mulCreditAndGradePoint += data.credit * data.grade
    })
    if (Number.isNaN(mulCreditAndGradePoint)) {
      errorEncountered = true
    }
    let sgpa = mulCreditAndGradePoint / totalCredit
    if (Number.isNaN(sgpa)) {
      errorEncountered = true
    }
    createTableBody(preparedData)
    updateTableFooter(totalCredit)
    document.querySelector('.sgpa').textContent = sgpa.toFixed(2)
    showContainer(errorEncountered)
  }

  function createTableBody(tableData) {
    const tableBody = document.querySelector('tbody')
    // remove pre-existing table row(s)
    if (tableBody.childNodes.length > 0) {
      tableBody
        .querySelectorAll('*')
        .forEach((eachElement) => eachElement.remove())
    }
    tableData.forEach((data, index) => {
      let tableRow = tableBody.insertRow()
      let sn = tableRow.insertCell(0) // serial number
      let subject = tableRow.insertCell(1)
      let credit = tableRow.insertCell(2)
      let letterGrade = tableRow.insertCell(3)
      sn.textContent = ++index
      subject.textContent = data.subject === '' ? '-' : data.subject
      credit.textContent = data.credit
      letterGrade.textContent = data.letterGrade
    })
  }

  function updateTableFooter(totalCredits) {
    let tableFooter = document.querySelector('tfoot')
    let tableRow = tableFooter.querySelectorAll('td')
    tableRow[1].innerText = totalCredits
  }

  function letterGradeToGradeValueConversion(letterGrade) {
    return {
      'A+': 4,
      A: 3.75,
      'B+': 3.5,
      B: 3,
      C: 2.5,
      D: 1.75,
      F: 0,
    }[letterGrade]
  }

  function showContainer(isError) {
    let container = document.querySelector('.response')
    if (container.classList.contains('hidden')) {
      container.classList.toggle('hidden')
    }
    let successElement = document.querySelector('.when-success')
    let errorElement = document.querySelector('.when-error')
    if (isError) {
      if (!successElement.classList.contains('hidden')) {
        successElement.classList.add('hidden')
      }
      if (errorElement.classList.contains('hidden')) {
        errorElement.classList.remove('hidden')
      }
    } else {
      if (!errorElement.classList.contains('hidden')) {
        errorElement.classList.add('hidden')
      }
      successElement.classList.remove('hidden')
    }
  }
}
