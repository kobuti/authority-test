export const JsonProperty = (propertyKey: string) => {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) => {
    // descriptor.value = function () {
    //   return method.apply(this, arguments);
    // };
  };
};
