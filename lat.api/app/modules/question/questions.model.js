//  import sql
const sql = require("../../config/db.config");
const questions = function (orgType) {};

// Question_create function..
questions.create = (newquestions, result) => {
  sql.query(`SELECT * FROM questions WHERE question_text = '${newquestions.question_text }' AND status !='D';`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    else if(res.length == 0){
      sql.query(`INSERT INTO questions SET ?`, newquestions, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        result(null, { ...newquestions });
      });
    }
    else{
      result(err || "question already used..",null);
    }
  });


};

// Create multi Question function
questions.CreateMultiQuestion = (newQuestions, result) => {
  // Check if any of the questions already exist in the database
  let sqlQuery = `SELECT question_text FROM questions WHERE (`;
let escapedQuestions = newQuestions.map(question => sql.escape(question.question_text));
for (let i = 0; i < escapedQuestions.length; i++) {
  if (i > 0) {
    sqlQuery += ` OR `;
  }
  sqlQuery += `question_text = ${escapedQuestions[i]}`;
}
sqlQuery += `) ;`;

sql.query(sqlQuery, (err, res) => {
  if (err) {
    result(err, null);
    return;
  }

    // Filter out any existing questions
    let existingQuestions = res.map(row => row.question_text);
    let newQuestionsToInsert = newQuestions.filter(question => !existingQuestions.includes(question.question_text));
    console.log("existing Question",res);
    // Create an array of values and placeholders for each question to insert
    let values = newQuestionsToInsert.map(question => [
      question.question_text,
      question.explanation,
      question.test_case,
      question.keyword,
    ]);
    let placeholders = newQuestionsToInsert.map(() => "(?, ?, ?, ?)").join(",");

    // Insert the new questions into the database
    if (res.length  <= 0) {
      sqlQuery = `INSERT INTO questions (question_text, explanation, test_case, keyword) VALUES ${placeholders};`;
      sql.query(sqlQuery, values.flat(), (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        result(null, { ...newQuestionsToInsert });
      });
    } else {
      result(`All of the following questions already exist: ${existingQuestions.join(', ')}`, null);
    }
  });
};

// Define the getAll function with search query, page, and limit parameters
questions.getAll  = (Q, page, limit) => {
  return new Promise((resolve, reject) => {
    // Check if search query is provided
    if (Q != undefined) {
      var key_value = `%${Q}%`;
		var Query = `select * from questions where ((question_text LIKE '${key_value}') or(test_case LIKE '${key_value}')or(question_id  LIKE '${key_value}') )and status != 'D' ;`;
    }
    else{
      var Query = `select * from questions where status != 'D' ;`
    }
     // Execute the SQL query
    sql.query(Query, (err, model, field) => {
      if (err) throw err;    
      // Check if pagination parameters (page and limit) are provided
      if (page && limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};   
        // Check if there are more results for next page
        if (endIndex < model.length) {
          results.next = {
            page: page + 1,
            limit: limit
          };
        }     
        // Check if there are results for previous page
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          };
        }
        // Slice the results based on startIndex and endIndex for pagination
        results.results = model.slice(startIndex, endIndex);
        var data = JSON.parse(JSON.stringify(results));
      } else {
        // If pagination parameters are not provided, return all results
        var data = JSON.parse(JSON.stringify(model));
      }
      // Resolve the data to return as the result of the promise
      resolve(data);
    });
  });
};



//Update function..
questions.updateById = (id, questions, result) => {
  sql.query(`SELECT * FROM questions WHERE question_text = '${questions.question_text}' AND status !='D';`, (err, res) => {
    if (err) {
		 console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length > 0) {
      result("question already used..", null);
      return;
    }
    sql.query(
		 "UPDATE questions SET question_text = ?, test_case = ?, updated_at = NOW() WHERE question_id = ?;",
      [questions.question_text, questions.test_case, id],
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        if (res.affectedRows === 0) {
          result({ kind: "not_found" }, null);
          return;
        }
		console.log(`updated questions: ${id}`, { id: id, ...questions });
        result(null, { id: id, ...questions });
      }
    );
  });
};




//find function..
questions.findById = (id, result) => {
  sql.query(`SELECT * FROM  questions WHERE question_id  =${id} and status != 'D'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found question: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found
    result({ kind: "not_found" }, null);
  });
};

//deleting function..
questions.remove = (id, result) => {
  sql.query(`UPDATE  questions SET status = 'D' WHERE question_id = ?`, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }
    console.log(`deleted  question   id: ${id}`);
    result(null, res);
  });
};

module.exports = questions;
