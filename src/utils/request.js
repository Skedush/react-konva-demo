import axios from 'axios';
import { cloneDeep, isEmpty } from 'lodash';
import { pathToRegexp } from 'path-to-regexp';
import qs from 'qs';

const { CancelToken } = axios;
window.cancelRequest = new Map();

axios.defaults.withCredentials = true;

/**
 * axios的请求封装，地址判断、错误处理
 *
 * @export
 * @param {object} options 请求选项
 * @returns {Promise} 请求结果
 */
export default function request(options) {
  const { data, url, method = 'get' } = options;

  if (!url) {
    throw new Error('request url none');
  }

  const cloneData = cloneDeep(data);
  const newUrl = matchRestfulUrl(url, cloneData);

  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${newUrl}${isEmpty(cloneData) ? '' : '?'}${qs.stringify(cloneData)}`
      : newUrl;

  options.cancelToken = new CancelToken((cancel) => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    });
  });

  options.headers = { 'X-Request-Type': 'ajax' };
  return axios(options)
    .then((response) => {
      let statusCode = response.status;
      if (options.responseType === 'blob') {
        return {
          data: response.data,
        };
      }

      if (statusCode >= 300 || statusCode < 200) {
        throw new Error(response);
      } else {
        // messageWithCRUDUrl(newUrl, value);
        return Promise.resolve(response);
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}

/**
 * 正则匹配restful风格请求并替换对应参数，返回新的url
 * eg: /:id/get, data参数保证必须有id属性
 *
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @returns {string} 新的地址
 */
function matchRestfulUrl(url, data) {
  let newUrl = url;

  try {
    let domain = '';
    const urlMatch = newUrl.match(/[a-zA-z]+:\/\/[^/]*/);
    if (urlMatch) {
      [domain] = urlMatch;
      newUrl = newUrl.slice(domain.length);
    }

    const match = pathToRegexp.parse(newUrl);
    newUrl = pathToRegexp.compile(newUrl)(data);

    for (const item of match) {
      if (item instanceof Object && item.name in data) {
        delete data[item.name];
      }
    }
    newUrl = domain + newUrl;
  } catch (e) {
    newUrl = url;
  }

  return newUrl;
}
