
describe('HRIS user file services', function() {

    before(function(done) {
        done();
    });
    
    var fileData = 'Hello World';
    var fileName = 'hello.txt';
    var fileID;
    
    it('upload file data', function(done) {
        
        $.ajax({
            url: '/hris/userfile/upload',
            type: 'POST',
            dataType: 'json',
            contentType: 'multipart/form-data; boundary=---------------------------43400674214968475821893869716',
            processData: false,
            data: '-----------------------------43400674214968475821893869716\r\nContent-Disposition: form-data; name="files[]"; filename="'+ fileName +'"\r\nContent-Type: text/plain\r\n\r\n'+ fileData +'\r\n-----------------------------43400674214968475821893869716--\r\n'
        })
        .done(function(msg) {
            fileID = msg.data.userfile_id;
            chai.assert.isNumber(fileID);
            done();
        })
        .fail(function(jqXHR, textStatus) {
            throw textStatus;
        });
        
    });
     
    
    it('fetch userfile model', function(done) {
    
        hris.Userfile.findOne({userfile_id: fileID})
        .then(function(model) {
            chai.assert.equal(model.userfile_id, fileID);
            done();
        })
        .fail(function(err) {
            throw "Userfile entry [" + fileID + "] not found in DB";
        });
    
    }); 
    
    
    it('get userfile info', function(done) {
        
        $.ajax({
            url: '/hris/userfile/info/' + fileID,
            type: 'GET',
            dataType: 'json'
        })
        .done(function(msg) {
            chai.assert(msg.success);
            chai.assert.equal(msg.data.name, fileName);
            chai.assert.equal(msg.data.type, 'text/plain');
            done();
        })
        .fail(function(jqXHR, textStatus) {
            throw textStatus;
        });
        
    });
    
    
    it('download file', function(done) {

        $.ajax({
            url: '/hris/userfile/download/' + fileID,
            type: 'GET',
            dataType: 'text'
        })
        .done(function(msg) {
            chai.assert.equal(msg, fileData);
            done();
        })
        .fail(function(jqXHR, textStatus) {
            throw textStatus;
        });
        
    
    });
    
    
    it('delete file', function(done) {
    
        $.ajax({
            url: '/hris/userfile/delete/' + fileID,
            type: 'DELETE',
            dataType: 'json'
        })
        .done(function(msg) {
            chai.assert(msg.success);
            done();
        })
        .fail(function(jqXHR, textStatus, err) {
            throw err;
        });
    
    });
    
    
    it('userfile is gone after delete', function(done) {
    
        hris.Userfile.findAll({userfile_id: fileID})
        .then(function(list) {
            chai.assert.lengthOf(list, 0, "Userfile entry is still there after deleting");
            done();
        })
        .fail(function(err) {
            throw err;
        });
    
    }); 
    
    
    
    after(function(done) {
        done();
    });
    
});

