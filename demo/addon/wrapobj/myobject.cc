#define BUILDING_NODE_EXTENSION
#include <node.h>
#include "myobject.h"

using namespace v8;

Persistent<Function> MyObject::constructor;

MyObject::MyObject(double value) : m_value(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init() {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
  tpl->SetClassName(String::NewSymbol("MyObject"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);
  constructor = Persistent<Function>::New(tpl->GetFunction());
}

Handle<Value> MyObject::New(const Arguments& args) {
  HandleScope scope;

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ? 0 : args[0]->NumberValue();
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    return args.This();
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0]};
    return scope.Close(constructor->NewInstance(argc, argv));
  }
}

Handle<Value> MyObject::NewInstance(const Arguments& args) {
  HandleScope scope;

  const unsigned argc = 1;
  Handle<Value> argv[argc] = { args[0]};
  Local<Object> instance = constructor->NewInstance(argc, argv);

  return scope.Close(instance);
}


// #define BUILDING_NODE_EXTENSION
// #include <node.h>
// #include "myobject.h"

// using namespace v8;

// Persistent<Function> MyObject::constructor;

// MyObject::MyObject(double value) : m_value(value) {

// }

// MyObject::~MyObject() {

// }

// void MyObject::Init() {
// 	Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
// 	tpl->SetClassName(String::New("MyObject"));
// 	tpl->InstanceTemplate()->SetInternalFieldCount(1);
// 	constructor = Persistent<Function>::New(tpl->GetFunction());
// }

// Handle<Value> MyObject::NewInstance(const Arguments& args) {
// 	HandleScope scope;

// 	const int argc = 1;
// 	Handle<Value> argv[argc] = { args[0] };
// 	Local<Object> obj = constructor->NewInstance(argc, argv);
	
// 	return scope.Close(obj);
// }

// Handle<Value> MyObject::New(const Arguments& args) {
// 	HandleScope scope;

// 	if (args.IsConstructCall()) {
// 		//invoke as constructor , `new MyObject()`
// 		double value = args[0]->IsUndefined() ? 0 : args[0]->NumberValue();
// 		MyObject* pObj = new MyObject(value);
// 		pObj->Wrap(args.This());
// 		return args.This();
// 	} else {
// 		//Invoked as plain function `MyObject()`, turn into construct call
// 		const int argc = 1;
// 		Local<Value> argv[argc] = { args[0] };
// 		return scope.Close(constructor->NewInstance(argc, argv));
// 	}
	
// }












