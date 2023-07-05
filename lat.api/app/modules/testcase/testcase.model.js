//  import sql
const sql = require("../../config/db.config");
const Testcase = function (orgType) {};

const valid = async (student_email, question_id, question_text, runtime, code, input, output, language, codelengthcount, codelettercount, compilestatus, codeVerify, testcaseverify) => {

  const compileVerifymark = compilestatus ? 2 : 0;
  const codeVerifymark = codeVerify ? compilestatus ? 2 : 1 : 0;
  const testcaseVerifymark = testcaseverify ? 2 : 0;
  const ifattendassesment = codelengthcount > 0 ? 1 : 0;


  if (runtime === 1) {
    const run_time = {
      runcount: 1,
      code,
      input: input || "",
      output,
      codelengthcount,
      codelettercount,
      compilestatus,
      codeVerify,
      testcaseverify,
      compileVerifymark,
      codeVerifymark,
      testcaseVerifymark,
      ifattendassesment,
      mark: compileVerifymark + codeVerifymark + testcaseVerifymark + ifattendassesment,
    }
    // Insert Assessment into the database
    if(testcaseverify){
    try {
      const query =
        "INSERT INTO assessment (assessment_status , student_email, question_id,question_text, language, run_time ) VALUES (?,?, ?, ?, ?,?)";
      const values = [
        "completed",
        student_email,
        question_id,
        question_text,
        language,
        JSON.stringify(run_time)
      ];
      await sql.query(query, values);
      console.log("Added assessment to the database");
    } catch (err) {
      console.log(err);
    }
  }else{
    try {
      const query =
        "INSERT INTO assessment (student_email, question_id,question_text, language, run_time ) VALUES (?, ?, ?, ?,?)";
      const values = [
        student_email,
        question_id,
        question_text,
        language,
        JSON.stringify(run_time)
      ];
      await sql.query(query, values);
      console.log("Added assessment to the database");
    } catch (err) {
      console.log(err);
    }

  }
  } else {
    sql.query(`SELECT run_time FROM  assessment WHERE question_id = ${question_id} and student_email = '${student_email}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return;
      }
  
      if (res.length) {
       // console.log("found student: ", res);
        const run_time = res;
        const runcount = run_time.length + 1;
        const newRuntime = {
          runcount,
          code,
          input: input || "",
          output,
          codelengthcount,
          codelettercount,
          compilestatus,
          codeVerify,
          testcaseverify,
          compileVerifymark,
          codeVerifymark,
          testcaseVerifymark,
          ifattendassesment,
          mark: compileVerifymark + codeVerifymark + testcaseVerifymark + ifattendassesment,
        };
        if(testcaseverify){
        const updateQuery = "UPDATE assessment SET assessment_status = ? ,run_time = JSON_ARRAY_APPEND(run_time, '$', ?) WHERE question_id = ? AND student_email = ?";
        const updateValues = [
          "completed",
          JSON.stringify(newRuntime),
          question_id,
          student_email
        ];
        sql.query(updateQuery, updateValues, (err, res) => {
          if (err) {
            console.log("error: ", err);
            return;
          }
          console.log("Added runtime to assessment");
          return;
        });
      }else{
        const updateQuery = "UPDATE assessment SET run_time = JSON_ARRAY_APPEND(run_time, '$', ?) WHERE question_id = ? AND student_email = ?";
        const updateValues = [
          JSON.stringify(newRuntime),
          question_id,
          student_email
        ];
        sql.query(updateQuery, updateValues, (err, res) => {
          if (err) {
            console.log("error: ", err);
            return;
          }
          console.log("Added runtime to assessment");
          return;
        });
      }
        
      }
      //console.log("not_found");
    });
  }

}


//check and valid test case function..
Testcase.check = (testcasedata, result) => {
    const code = testcasedata.code;
    const input = testcasedata.input;
    const output = testcasedata.output;
    const question_id = testcasedata.question_id;
    const question_text = testcasedata.question_text;
    const student_email = testcasedata.student_email;
    const language = testcasedata.language;
    const compilestatus = testcasedata.compilestatus;
    const runtime = testcasedata.runtime;

    if(compilestatus){
    sql.query(`SELECT * FROM  questions WHERE question_id  =${question_id} and status != 'D'`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    
        if (res.length) {
          //console.log("found question: ", res[0]);
          var TestCases = JSON.parse(res[0].test_case);
          //.log(TestCases);
          var keyValuesForDatabase = res[0].keyword.split(", ");
          console.log(keyValuesForDatabase);
          // SQL query to fetch keywords for the specified language
          const query = `SELECT ${keyValuesForDatabase.join(',')} FROM programming_languages WHERE name = ?`;
          // Execute the query and get the result as an array of objects
          sql.query(query, [language], (err, rows) => {
          if (err) throw err;

          // Get the first (and only) row from the result
          const languageKeywords = rows[0];

          let isValid = true;
          for (i = 0; i < keyValuesForDatabase.length; i++) {
            const Keywords = languageKeywords[keyValuesForDatabase[i]].split(",");
            const hasKeyword = Keywords.some(keyword => code.includes(keyword));
            console.log(Keywords);
            if (!hasKeyword) {
              isValid = false;
              break;
            }
          }
          if(isValid ){
            // Log the result to the console
            console.log(`Code is 'valid'`);
            var  TestCase = false;
            for (j=0; j<TestCases.length; j++){
              if (input === TestCases[j].sample_input && output.toLowerCase().trim().replace(/\s/g, "").replace(/\n$/, "") === TestCases[j].sample_output.toLowerCase().trim().replace(/\s/g, "").replace(/\n$/, "")){
                TestCase = true;
                var TestCaseRound = j;
                break
              }else{
                if (!input && !TestCases[j].sample_input){
                  if(output.toLowerCase().replace(/\s/g, "").replace(/\n$/, "") === TestCases[j].sample_output.toLowerCase().replace(/\s/g, "").trim().replace(/\n$/, "")){
                    TestCase = true;
                    var TestCaseRound = j;
                  }
                }
                
              }
            }

            if(TestCase){
              var codeVerify = true;
              result(null,{codeVerify:true, testcase:true ,testcaseno:TestCaseRound});
              valid(student_email,question_id,question_text, runtime, code , input , output,language, codelengthcount = code.split("\n").length, codelettercount = code.length, compilestatus, codeVerify,testcaseverify = true);
             
              return;
            }
            else{
              var codeVerify = true;
              result({ codeVerify:true ,testcase:false},null);
              valid(student_email,question_id, question_text, runtime, code , input , output,language, codelengthcount = code.split("\n").length, codelettercount = code.length, compilestatus, codeVerify,testcaseverify = false);
             
              return;
            }
            //console.log("testcase :" ,TestCase);
          }else{
            var codeVerify = false;
           result({ codeVerify:false}, null);
           valid(student_email,question_id, question_text,runtime, code , input , output,language, codelengthcount = code.split("\n").length, codelettercount = code.length, compilestatus, codeVerify,testcaseverify = false);
           
           return;
          }
          });
        }
  });
}else{
  sql.query(`SELECT * FROM  questions WHERE question_id  =${question_id} and status != 'D'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found question: ", res[0]);
      var TestCases = JSON.parse(res[0].test_case);
      //.log(TestCases);
      var keyValuesForDatabase = res[0].keyword.split(", ");
      console.log(keyValuesForDatabase);
      // SQL query to fetch keywords for the specified language
      const query = `SELECT ${keyValuesForDatabase.join(',')} FROM programming_languages WHERE name = ?`;
      // Execute the query and get the result as an array of objects
      sql.query(query, [language], (err, rows) => {
      if (err) throw err;

      // Get the first (and only) row from the result
      const languageKeywords = rows[0];

      let isValid = true;
      for (i = 0; i < keyValuesForDatabase.length; i++) {
        const Keywords = languageKeywords[keyValuesForDatabase[i]].split(",");
        const hasKeyword = Keywords.some(keyword => code.includes(keyword));
        console.log(Keywords);
        if (!hasKeyword) {
          isValid = false;
          break;
        }
      }
      if(isValid ){
        // Log the result to the console
        console.log(`Code is 'valid'`);       
        let codeVerify = true;
          result({ codeVerify:true },null);
          valid(student_email,question_id, question_text,runtime, code , input , output, language,codelengthcount = code.split("\n").length, codelettercount = code.length, compilestatus, codeVerify,testcaseverify = false);
          
          return;

        //console.log("testcase :" ,TestCase);
      }else{
      var codeVerify = false;
       result({ codeVerify:false}, null);
       valid(student_email,question_id, question_text , runtime, code , input , output, language,codelengthcount = code.split("\n").length, codelettercount = code.length, compilestatus, codeVerify,testcaseverify = false);
       return;
      }
      });
    }
});
}

};


module.exports =Testcase;
   