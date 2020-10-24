function checkAndReplace(value) {
  if(value === null){
    return null;
  }
  return value.replaceAll("'","''");
}

let Owner = function (id, avatar_url, html_url, type, site_admin) {
  this.id = id;
  this.avatar_url = checkAndReplace(avatar_url);
  this.html_url = checkAndReplace(html_url);
  this.type = checkAndReplace(type);
  this.site_admin = site_admin;
}

let GithubInfo = function (id, name, html_url, description, created_at, open_issues, watchers, owner) {
  this.id = id;
  this.name = checkAndReplace(name);
  this.html_url = checkAndReplace(html_url);
  this.description = checkAndReplace(description);
  this.created_at = checkAndReplace(created_at);
  this.open_issues = open_issues;
  this.watchers = watchers;
  this.owner = owner;
};

GithubInfo.fromJson = function (json) {
  return new GithubInfo(
    json.id,
    json.name,
    json.html_url,
    json.description,
    json.created_at,
    json.open_issues,
    json.watchers,
    new Owner(
      json.owner.id,
      json.owner.avatar_url,
      json.owner.html_url,
      json.owner.type,
      json.owner.site_admin,
    ));
};

module.exports = {
  GithubInfo,
  Owner
}
