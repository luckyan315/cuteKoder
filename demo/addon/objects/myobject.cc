#define BUILDING_NODE_EXTENSION
#include <iostream>
#include "myobject.h"

using namespace v8;

Persistent<Function> MyObject::constructor;

MyObject::MyObject(double value) : m_value(value) {

}

MyObject::~MyObject(){

}

void MyObject::Init(Handle<Object> exports) {
	HandleScope scope;
	
	Local<FunctionTemplate> tpl = FunctionTemplate::New(MyObject::New);

	tpl->SetClassName(String::NewSymbol("MyObject"));
	tpl->InstanceTemplate()->SetInternalFieldCount(1);
	
	//prototype
	tpl->PrototypeTemplate()->Set(String::NewSymbol("plusOne"),
								  FunctionTemplate::New(MyObject::PlusOne)->GetFunction());
	constructor = Persistent<Function>::New(tpl->GetFunction());
	exports->Set(String::NewSymbol("MyObject"), constructor);
}

Handle<Value> MyObject::New(const Arguments& args) {
	HandleScope scope;
	
	if (args.IsConstructCall()) {
		//invoked as constructor
		std::cout<<"[ConstructCall]"<<std::endl;
		double value = args[0]->IsUndefined() ? 0 : args[0]->NumberValue();
		MyObject* pObj = new MyObject(value);
		pObj->Wrap(args.This());
		return args.This();
	} else {
		//invoked as plain function 'MyObject()', turn into construct call.
		std::cout<<"[PlainFuncionCall]"<<std::endl;
		const int argc  = 1;
		Local<Value> argv[argc] = { args[0]};
		return scope.Close(constructor->NewInstance(argc, argv));
	}
}

Handle<Value> MyObject::PlusOne(const Arguments& args) {
	HandleScope scope;

	MyObject* pObj = ObjectWrap::Unwrap<MyObject>(args.This());
	pObj->m_value += 1;

	return scope.Close(Number::New(pObj->m_value));
}



















