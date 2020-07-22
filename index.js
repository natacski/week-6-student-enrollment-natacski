let students_body = document.getElementById('students_data_body');
let students_button = document.getElementById('students');
let courses_body = document.getElementById('courses_data_body');
let courses_button = document.getElementById('courses');
let studentsURL = 'https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Students.json';
let coursesURL = 'https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Courses.json';
let studentsInfo = [];
let coursesInfo = [];
let submitNewStudent = document.getElementById('submit_btn');
let editStudentButton = document.getElementById('edit-student-submit');

/*==========================================
 Event Listeners
===========================================*/
students_button.addEventListener('click', () =>{
  showStudents();
})

courses_button.addEventListener('click', () =>{
  showCourses();
})
submitNewStudent.addEventListener('click', (e) => {
  addNewStudent();
})


/*============================================
 Getting all data and storing in one function
==============================================*/
async function allData() {
  let response = await fetch(studentsURL);
  studentsInfo = await response.json();
  
  studentsInfo.forEach(student => {
    student.courses = [];
  });
  response = await fetch(coursesURL);
  coursesInfo = await response.json();

  coursesInfo.forEach(course => {
    course.students = [];
  });

  document.getElementById('students').disabled = false;
  document.getElementById('courses').disabled = false; 
}

/*======================================================
STUDENTS BUTTON
========================================================*/

 //Checking students status-making display the green circle
function checkStudentStatus(studentStatus){
  if(studentStatus === true) {
    return '<span title="active student" class="dot"></span>'
  }else{
    return '<span></span>'
  }
}

//Displaying students cards with the data
const showStudents = () =>{
  document.getElementById('students_data_body').hidden = false;
  document.getElementById('courses_data_body').hidden = true;

  let options = ''
  coursesInfo.forEach(course => {
    options += '<option value="' + course.id + '">' + course.name +  '</option>';  
  });

  students_body.innerHTML = ''; 
    studentsInfo.forEach(student => {
      let status = checkStudentStatus(student.status) ;
      let studentsCourses = '';

      student.courses.forEach( course => {
        studentsCourses += "<li>" + course.name + "</li>"    
      });
      //Creating the html cards for students
      students_body.innerHTML += ` <div class="container">
                                      <div class="col-sm-3  m-4 float-left">
                                          <div class="card" style="width: 18rem; height: 20rem;">
                                            <div class="card-body">
                                              <h5 class="card-title pt-4"> ${student.name}  ${student.last_name}  ${status} </h5>
                                              <p><ul> ${studentsCourses} </ul></p>
                                              <div>
                                                <select class="courseList">
                                                    ${options}
                                                </select>
                                                  <button type="button" class="btn btn-outline-primary btn-sm mt-4 addCourse" studentId="${student.id}">Add course</button>
                                                  <button onclick="editStudent('${student.id}')" type="button" class="btn btn-outline-primary btn-sm mt-4 edit-info" studentId="${student.id}">Edit info</button>
                                              </div>
                                            </div>
                                          </div>
                                      </div>
                                   </div>`                        
  } ); 

/*-----ADD COURSE BUTTON----------*/
//displaying the list of courses available in the Add course button
const addCoursesButtonClass= document.querySelectorAll('.addCourse');
  addCoursesButtonClass.forEach (el => el.addEventListener('click', event =>{
      let courseId = el.parentElement.getElementsByTagName('select')[0].value;
      let studentId = el.attributes["studentId"].value;
      console.log(courseId);
      console.log(studentId);
      addCourseToStudent(courseId, studentId);
  }));
}

//if statements 
const addCourseToStudent = ( courseId, studentId ) => {
  let courseToAdd = coursesInfo.filter( course => course.id === parseInt(courseId))[0];
  let studentToAddTo = studentsInfo.filter( student => student.id === parseInt(studentId))[0];
  
    if (studentToAddTo.courses.filter( course => course.id === parseInt(courseId)).length > 0)
    {
      alert('Course already exists for student');
      return false;
    }

    if ( studentToAddTo.courses.length === 4)
    {
      alert('This student already has a maximum of 4 courses');
      return false;
    }
    if ( courseToAdd.students.length === 3)
    {
      alert('This course has been reached the limit of 3 students');
      return false;
    }

  studentToAddTo.courses.push(courseToAdd);
  courseToAdd.students.push(studentToAddTo);
  showStudents();
}



/*-----EDIT STUDENTS INFO BUTTON----------*/
editStudentButton.addEventListener('click', (e) =>{
  let studentId = e.target.getAttribute('studentId');
  let name = document.getElementById('name_edit').value;
  let last_name = document.getElementById('lastName_edit').value;
  let active = document.getElementById('status-drop-down').value;
  let studentToEdit = studentsInfo.filter( student => student.id === parseInt(studentId))[0];

  studentToEdit.name = name;
  studentToEdit.last_name = last_name;
  studentToEdit.status = active == "true";

  $('#modal-edit-student').modal('hide');

  showStudents();
})


//Edit info button-Student info with the existing information to display in modal form
const editStudent = ( studentId ) =>{
   let studentToEdit = studentsInfo.filter( student => student.id === parseInt(studentId))[0];

  document.getElementById("edit-student-submit").setAttribute('studentId', studentId);
  document.getElementById('name_edit').value = studentToEdit.name;
  document.getElementById('lastName_edit').value = studentToEdit.last_name;
  document.getElementById('status-drop-down').value = studentToEdit.status;

  $('#modal-edit-student').modal('show');
}


/*======================================================
COURSES BUTTON
========================================================*/

//Displaying couses cards with the data
const showCourses = () =>{
  document.getElementById('students_data_body').hidden = true;
  document.getElementById('courses_data_body').hidden = false;

  let options = ''
  studentsInfo.forEach(student => {
    options += '<option value="' + student.id + '">' + student.name + ' ' +  student.last_name +  '</option>';  
  });

    courses_body.innerHTML = ''; 
    coursesInfo.forEach(course => {
      let allStudents = '';

      course.students.forEach( student => {
        allStudents += "<li>" + student.name + ' ' +  student.last_name +"</li>"    
      });

      courses_body.innerHTML += ` <div class="container">
                                      <div class="col-sm-3 m-4 float-left">                                 
                                          <div class="card" style="width: 20rem; height: 17rem;">
                                            <div class="card-body">
                                              <h5 class="card-title"> ${course.name}  <span class="badge badge-primary badge-pill"> ${course.duration} </span> </h5>
                                              <p><ul> ${allStudents} </ul></p>
                                              <div>
                                                  <select class="courseList">
                                                      ${options}
                                                  </select><br>
                                                  <button type="button" class="btn btn-outline-primary btn-sm mt-4 addStudent" courseId="${course.id}">Add student</button>
                                               </div>
                                              </div>
                                          </div>
                                      </div>
                                    </div>` 
} ); 

/*-----ADD STUDENT BUTTON----------*/
const addStudentButtonClass= document.querySelectorAll('.addStudent');
  addStudentButtonClass.forEach (el => el.addEventListener('click', event =>{
      let studentId = el.parentElement.getElementsByTagName('select')[0].value;
      let courseId = el.attributes["courseId"].value;
      console.log(studentId);
      console.log(courseId);
      addStudentToCourse(studentId, courseId);
  }));
}

const addStudentToCourse = ( studentId, courseId ) => {
  let studentToAdd = studentsInfo.filter( student => student.id === parseInt(studentId))[0];
  let courseToAddTo = coursesInfo.filter( course => course.id === parseInt(courseId))[0];

    if (courseToAddTo.students.filter( student => student.id === parseInt(studentId)).length > 0)
    {
      alert('Course already exists for student');
      return false;
    }

    if ( courseToAddTo.students.length === 3)
    {
      alert('This course has reached the limit of 3 students');
      return false;
    }
    if ( studentToAdd.courses.length === 4)
    {
      alert('This student already has a maximum of 4 courses');
      return false;
    }
  courseToAddTo.students.push(studentToAdd);
  studentToAdd.courses.push(courseToAddTo);
  showCourses();
}

/*======================================================
NEW STUDENT BUTTON
========================================================*/
//Adding new student function
const addNewStudent = () =>{
  
  const name = document.getElementById('name').value;
  const last_name = document.getElementById('lastName').value;
  
  studentsInfo.push({id: studentsInfo.length, name: name, last_name: last_name, status:true, courses:[]});
  
  $('#new_student').modal('hide');
  showStudents();
}


allData();


