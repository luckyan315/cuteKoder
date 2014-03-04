#define BUILDING_NODE_EXTENSION
#include <node.h>

using namespace v8;

Handle<Value> add(const Arguments& args) {
	HandleScope scope;

	if (args.Length() < 2) {
		ThrowException(Exception::TypeError(String::New("Need two arguments (number)!")));
		return scope.Close(Undefined());
	}

	if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
		ThrowException(Exception::TypeError(String::New("Arguments must be a number!")));
	}

	Local<Number> num = Number::New(args[0]->NumberValue() + args[1]->NumberValue());
	return scope.Close(num);
}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("add"), FunctionTemplate::New(add)->GetFunction());
}

NODE_MODULE(funcargs, init)

















