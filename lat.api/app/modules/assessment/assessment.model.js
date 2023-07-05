//  import sql
const sql = require("../../config/db.config");
const Assessment = function (orgType) {};


Assessment.submit = (newSubmit, result) => {
  sql.query(
    `SELECT run_time FROM assessment WHERE question_id = ? AND student_email = ?`,
    [newSubmit.question_id, newSubmit.student_email],
    (err, res) => {
      if (err) {
        console.log(err);
        result(err, null);
        return;
      }

      const runTimes = res.length ? JSON.parse(res[0].run_time) : [];
      let totalMark = 0;
      let runCount = 0;
      if(runTimes.length !== undefined){
      runTimes.forEach((runTime) => {
        runCount++;
        totalMark += typeof runTime === "string" ? JSON.parse(runTime).mark : runTime.mark;
      });
      }else{
      runCount++;
      totalMark += runTimes.mark;
      }
      totalMarkWithBonus =  runCount === 1 ? totalMark / runCount + 3.0
                          : runCount === 2 ? totalMark / runCount + 2.5
                          : runCount === 3 ? totalMark / runCount + 2.0
                          : runCount === 4 ? totalMark / runCount + 1.5
                          : runCount === 5 ? totalMark / runCount + 1.0
                          : totalMark / runCount;


      console.log(`RunCount: ${runCount}, Mark: ${totalMark}, Average Mark: ${totalMark / runCount}, Total Mark with Bonus: ${totalMarkWithBonus}`);
      
      const updateQuery = "UPDATE assessment SET  time_to_complete = ? , mark = ? , run_count = ? WHERE question_id = ? AND student_email = ?";
      const updateValues = [
        newSubmit.time_to_complete,
        totalMarkWithBonus,
        runCount,
        newSubmit.question_id,
        newSubmit.student_email
      ];
      sql.query(updateQuery, updateValues, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err,null);
          return;
        }
        console.log("Submit Assessment...");
        result(null, { runcount:runCount,average:totalMark / runCount,totalmark:totalMarkWithBonus , bonusmark:runCount <= 5 ? (3 - (runCount * 0.5)) : 0});
        return;
      });
    }
  );
};



// Define the getAll function with search query, page, and limit parameters
Assessment.getAll = (Q, page, limit) => {
  return new Promise((resolve, reject) => {
        // Check if search query is provided
    if (Q != undefined) {
      var key_value = `%${Q}%`;
		var Query = `select * from assessment where ((student_email LIKE '${key_value}') or(question_id LIKE '${key_value}') or (assessment_id LIKE '${key_value}') or(status LIKE '${key_value}')) ;`;
    }
    else{
      var Query = `select * from assessment ;`
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


//Assessment get with email and status
Assessment.findBySEmail = (email, status, result) => {
  let query = 'SELECT * FROM assessment WHERE student_email = ?';
  let params = [email];

  if (status) {
    query += ' AND assessment_status = ?';
    params.push(status);
  }

  sql.query(query, params, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found assessment: ", res[0]);
      result(null, res);
      return;
    }
    // not found
    result({ kind: "not_found" }, null);
  });
};


//find program with Question id..
Assessment.findByQId = (id, result) => {
  sql.query(`SELECT * FROM  assessment WHERE question_id =${id} `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found student: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found
    result({ kind: "not_found" }, null);
  });
};


//find program with program id..
Assessment.findById = (id, result) => {
  sql.query(`SELECT * FROM  assessment WHERE assessment_id =${id} `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found student: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found
    result({ kind: "not_found" }, null);
  });
};

module.exports = Assessment;
