const autoBind = require('auto-bind');

class UploadsHandler {
    constructor(service, validator, albumsService) {
        this._service = service;
        this._validator = validator;
        this._albumsService = albumsService;

        autoBind(this);
    }

    async postUploadImageHandler(request, h) {
        const { cover } = request.payload;
        const { id } = request.params;
        this._validator.validateImageHeaders(cover.hapi.headers);

        const filename = await this._service.writeFile(cover, cover.hapi);
        const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

        await this._albumsService.addCoverAlbumById(id, fileLocation);
        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah',
          });
          response.code(201);
          return response;
    }
}



module.exports = UploadsHandler;