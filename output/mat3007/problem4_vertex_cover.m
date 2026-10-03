% Requires CVX: variables follow the order a,b,c,d,e,f,g,h,i,j.
E = [1 2; 2 3; 3 4; 4 5; 5 1;
     1 6; 2 7; 3 8; 4 9; 5 10;
     6 8; 8 10; 10 7; 7 9; 9 6];
cvx_begin quiet
    variable x(10)
    minimize(sum(x))
    subject to
        x >= 0;
        x <= 1;
        x(E(:,1)) + x(E(:,2)) >= 1;
cvx_end
fprintf('LP status: %s\n', cvx_status);
disp('LP solution (a through j):'); disp(x');
fprintf('LP optimal value: %.8f\n', cvx_optval);
% Enumerate all binary vectors to verify the integer optimum.
best_value = inf;
best_x = [];
for mask = 0:(2^10-1)
    y = double(bitget(mask, 1:10))';
    if all(y(E(:,1)) + y(E(:,2)) >= 1) && sum(y) < best_value
        best_value = sum(y);
        best_x = y;
    end
end
disp('One integer optimal solution:'); disp(best_x');
fprintf('Integer optimal value: %d\n', best_value);
