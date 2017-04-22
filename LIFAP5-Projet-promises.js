const coll_ex = [
  {"_id":{"$id":"58d55ad7205853730071b5ae"},"name":"0054.jpg","desc":"Composition studio #54","albums":["dpt","cable"]},
  {"_id":{"$id":"58d55af0205853730071b5af"},"name":"0056.jpg","desc":"Composition studio #56","albums":["dpt","keyboard","licence"]},
  {"_id":{"$id":"58d55b08205853730071b5b0"},"name":"0068.jpg","desc":"Composition studio #68","albums":["dpt","keyboard","licence"]},
  {"_id":{"$id":"58d55b23205853730071b5b1"},"name":"0098.jpg","desc":"Composition studio #98","albums":["dpt","keyboard","licence","informatique"]},
  {"_id":{"$id":"58d55b33205853730071b5b2"},"name":"0099.jpg","desc":"Composition studio #99","albums":["dpt","keyboard","licence","informatique"]},
  {"_id":{"$id":"58d55b59205853730071b5b3"},"name":"0105.jpg","desc":"Composition studio #105","albums":["dpt","keyboard","licence","informatique","post-process"]}
];


const api_key = 'M5yB3BGO';
const api_key_parameter = 'api';

function staticPromise() {
  return Promise.resolve(coll_ex);
}  

function downloadPromise(url) {
  return new Promise(function(resolve, reject) {
    console.log("ajaxPromise [" + url + "] ...");
    // let formData = new FormData();
    let request = new XMLHttpRequest();
    //here API key is given in the URL
    request.open("GET", url + "?" + api_key_parameter + "=" + api_key);
    request.overrideMimeType("text/json");
    request.onload = function() {
      if (request.status === 200) {
        console.log("Done [" + url + "]");
        resolve(JSON.parse(request.response));
      } else 
        reject(Error("URL [" + url + "]; error code:" + request.statusText));
    };
    request.onerror = () => reject(Error("Network error on [" + url + "]."));
    // formData.append(api_key_parameter, api_key);
    request.send(); //JSON.stringify({api_key_parameter: api_key})
  });
}
// from https://github.com/mdn/js-examples

function uploadPromise(url, formElement) {
  return new Promise(function(resolve, reject) {
    console.log("uploadPromise [ " + url + "] ...");
    let formData = new FormData(formElement);
    let request = new XMLHttpRequest();
    request.open("POST", url);
    request.overrideMimeType("text/json");
    request.onload = function () {if (request.status === 200) {
        console.log("Done upload on [" + url + "]");
        resolve(JSON.parse(request.response));
      } else 
        reject(Error("URL [" + url + "]; error code:" + request.statusText));
    };
    request.onerror = () => reject(Error("Network error on [" + url + "]."));
    formData.append(api_key_parameter, api_key);
    request.send(formData);
  });
}
// modification of previous ajaxPromise for file uploading
// using https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects

function updatePromise(url, photo_data) {
  return new Promise(function(resolve, reject) {
    console.log(photo_data);
    url += photo_data['_id']['$id'];
    console.log("updatePromise [ " + url + "] ...");
    console.log(photo_data);
    // let formData = new FormData();
    let request = new XMLHttpRequest();
    request.open("PUT", url);
    request.overrideMimeType("text/json");
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {if (request.status === 200) {
        console.log("Done upload on [" + url + "]");
        resolve(JSON.parse(request.response));
      } else 
        reject(Error("URL [" + url + "]; error code:" + request.statusText));
    };
    request.onerror = (error) => { console.log(error); return reject(Error("Network error on [" + url + "]. ")) ;};
//    formData.append('data', JSON.stringify(photo_data));
//    formData.append(api_key_parameter, api_key);
    request.send(JSON.stringify({api: api_key, data: photo_data}));
  });
};

function resetPromise(url) {
  url += 'reset/'
  return new Promise(function(resolve, reject) {
    console.log("resetPromise [ " + url + "] ...");
    let formData = new FormData();
    let request = new XMLHttpRequest();
    request.open("POST", url);
    request.overrideMimeType("text/json");
    request.onload = function () {if (request.status === 200) {
        console.log("Done reset on [" + url + "]");
        resolve(JSON.parse(request.response));
      } else 
        reject(Error("URL [" + url + "]; error code:" + request.statusText));
    };
    request.onerror = () => reject(Error("Network error on [" + url + "]."));
    formData.append(api_key_parameter, api_key);
    request.send(formData);
  });
}
