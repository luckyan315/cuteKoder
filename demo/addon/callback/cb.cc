#include <iostream>
#include <node.h>

using namespace v8;

Handle<Value> runCallback(const Arguments& args) {
	HandleScope scope;
	std::cout<<"enter runCallback"<<std::endl;
	Local<Function> cb = Local<Function>::Cast(args[0]);
	const unsigned argc = 1;
	Local<Value> argv[argc] = { Local<Value>::New(String::New("hello world")) };
	cb->Call(Context::GetCurrent()->Global(), argc, argv);

	return scope.Close(Undefined());
}

void init(Handle<Object> exports, Handle<Object> module) {
	module->Set(String::NewSymbol("exports"), FunctionTemplate::New(runCallback)->GetFunction());
}

NODE_MODULE(callback, init)
