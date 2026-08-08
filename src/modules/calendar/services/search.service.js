const searchRepo = require('../repositories/search.repository');

class SearchService {
  async unifiedSearch(userEmail, applicationName, queryParams) {
    return await searchRepo.unifiedSearch(userEmail, applicationName, queryParams);
  }
}

module.exports = new SearchService();
