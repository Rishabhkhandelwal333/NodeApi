const Pool = require('pg').Pool

const model= require('../models/models')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'GithubData',
  password: 'Rishabh333',
  port: 5432,
})

insertOwner = async (owner) => {
  let isAlreadyPresent = (await pool.query(`SELECT * FROM owners WHERE id = ${owner.id}`)).rowCount > 0;
  if (!isAlreadyPresent) {
    await pool.query(`INSERT INTO owners VALUES(${owner.id}, '${owner.avatar_url}', '${owner.html_url}', '${owner.type}', ${owner.site_admin})`);
  } else {
    await pool.query(`UPDATE owners SET avatar_url = '${owner.avatar_url}', html_url = '${owner.html_url}', type = '${owner.type}', site_admin = ${owner.site_admin} WHERE id = ${owner.id}`);
  }
  return owner.id;
}

insertGithubInfo = async (githubInfo) => {
  let ownerId = await insertOwner(githubInfo.owner);

  let isAlreadyPresent = (await pool.query(`SELECT * FROM github_info WHERE id = ${githubInfo.id}`)).rowCount > 0;
  if (!isAlreadyPresent) {
    await pool.query(`INSERT INTO github_info VALUES(${githubInfo.id}, '${githubInfo.name}', '${githubInfo.html_url}', '${githubInfo.description}', '${githubInfo.created_at}', ${githubInfo.open_issues}, ${githubInfo.watchers}, ${ownerId})`);
  } else {
    await pool.query(`UPDATE github_info SET name = '${githubInfo.name}', html_url = '${githubInfo.html_url}', description = '${githubInfo.description}', created_at = '${githubInfo.created_at}', open_issues = ${githubInfo.open_issues}, watchers = ${githubInfo.watchers}, owner = ${ownerId} WHERE id = ${githubInfo.id}`);
  }
}


const insertIntoDatabase = async (githubInfo) => {
  await insertGithubInfo(githubInfo)
}

selectGithubInfo = async (id) => {

  let isAlreadyPresent = (await pool.query(`select  g.id,g.name,g.html_url as g_html_url , g.description,g.created_at,g.open_issues,g.watchers,g.owner,o.avatar_url,o.html_url as o_html_url , o.type , o.site_admin from github_info as g join owners as o on g.owner = o.id and g.id = ${id}`));
  if (isAlreadyPresent.rowCount > 0) {
    let data = isAlreadyPresent.rows[0];

    let result = new model.GithubInfo(
      data.id,
      data.name,
      data.g_html_url,
       data.description,
      data.created_at,
      data.open_issues,
      data.watchers,
      new model.Owner(
        data.owner,
        data.avatar_url,
        data.o_html_url,
        data.type,
        data.site_admin,
      ));
      return JSON.stringify(result);
  }  else{
    return JSON.stringify({"code":"404","msg" : "id not present in the database"});
  }
}

const selectFromDatabase = async (id) => {
  return await selectGithubInfo(id)
}

module.exports = {
  insertIntoDatabase,
  selectFromDatabase
}
